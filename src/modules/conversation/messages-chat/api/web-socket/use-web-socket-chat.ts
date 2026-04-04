'use client';

import { useCallback, useEffect, useRef } from 'react';
import type {
  ChangeStatusReadMessageAPI,
  CreateTextMessageAPI,
  DeleteMessageApi,
  RestMessageApi,
} from '../../model/messages-list';
import {
  serializerRequestChangeStatusReadMessageApiSchema,
  serializerRequestCreatingMessageApiSchema,
  serializerRequestDeleteMessageApiSchema,
} from '../../model/messages-list';
import { useMessagesChatStore, useUserIdStore } from '../../zustand-store/zustand-store';

type UseWebSocketChat = {
  sendMessage: (
    content: string,
    repliedMessageStore?: RestMessageApi | null | undefined,
    forwardMessageStore?: RestMessageApi | null | undefined,
  ) => void;
  sendProfile: (payload: CreateTextMessageAPI) => void;
  sendChangeStatusReadMessage: (message: RestMessageApi & { status?: 'pending' | 'sent' | 'failed' | 'read' }) => void;
  sendDeleteMessage: (
    message: RestMessageApi & { status?: 'pending' | 'sent' | 'failed' | 'read' },
    selected?: boolean,
  ) => void;
};

export function useWebSocketChat(wsUrl: string, currentUserId: string): UseWebSocketChat {
  // прописываем в компоненте актуальный user_uid открытого чата из store
  const userId = useUserIdStore((s) => s.userId);
  //делаем ссылку на актуальный user_uid открытого чата
  const userIdRef = useRef<string>(userId);
  useEffect(() => {
    userIdRef.current = userId;
  }, [userId]);
  // Ссылка на websocket подключение
  const wsRef = useRef<WebSocket | null>(null);
  //ссылка на uid текущего пользователя мессенджера
  const currentUserIdRef = useRef<string>(currentUserId);

  // блок, чтобы не было гонок
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isUnmountedRef = useRef(false);

  // чтобы игнорировать события от "старого" сокета
  const socketInstanceIdRef = useRef(0);

  // backoff
  const reconnectAttemptRef = useRef(0);
  const maxReconnectDelayMs = 30000;

  // установим начальныe значения сообщений из чатов, если пришёл user_uid с сервера
  const addMessageForUser = useMessagesChatStore.getState().addMessageForUser;
  const updateMessageByUidForUser = useMessagesChatStore.getState().updateMessageByUidForUser;
  const upsertMessageForUser = useMessagesChatStore.getState().upsertMessageForUser;
  const deleteMessageByUidForUser = useMessagesChatStore.getState().deleteMessageByUidForUser;
  // maccив интервалов [{requestUid:timeout_id},...] на каждое отправленное сообщение с помошью ws
  // нужно отследить через какое время на отправленное клиентом сообщение, ws пришлет ответ-подтверждение,
  // либо его вообще не пришлет
  const pendingTimeouts = useRef<Map<string, number | NodeJS.Timeout>>(new Map()); //
  // Функция для подключаемся к ws-соединению и регистрации ws-обработчиков

  const clearReconnectTimer = (): void => {
    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current);
      reconnectTimerRef.current = null;
    }
  };

  const scheduleReconnect = useCallback(() => {
    if (isUnmountedRef.current) return;
    if (!navigator.onLine) return; // нет интернета — не спамим
    if (reconnectTimerRef.current) return; // уже запланировано

    // backoff
    reconnectAttemptRef.current += 1;
    const delay = Math.min(1000 * Math.pow(2, reconnectAttemptRef.current - 1), maxReconnectDelayMs);

    reconnectTimerRef.current = setTimeout(() => {
      reconnectTimerRef.current = null;
      connectWS();
    }, delay);
  }, [wsUrl]); // connectWS объявим ниже (через function declaration или useCallback)

  const connectWS = useCallback(() => {
    if (!navigator.onLine) return;
    if (wsRef.current) {
      const st = wsRef.current.readyState;
      if (st === WebSocket.OPEN || st === WebSocket.CONNECTING) return;
    }
    clearReconnectTimer();

    // увеличиваем id инстанса
    const myId = ++socketInstanceIdRef.current;
    //подключение к ws-соединению
    const socket = new WebSocket(wsUrl);
    wsRef.current = socket;

    socket.onopen = (): void => {
      if (socketInstanceIdRef.current !== myId) return; // устаревший
      console.log('WebSocket open');
      reconnectAttemptRef.current = 0; // сброс backoff
    };

    socket.onclose = (e): void => {
      if (socketInstanceIdRef.current !== myId) return; // устаревший
      console.log('WebSocket close', e.code, e.reason);
      // Ошибки 1006 часто при обрыве сети/таймауте
      // Планируем reconnect
      scheduleReconnect();
    };

    socket.onerror = (err): void => {
      // ВАЖНО: не закрываем вручную, пусть onclose сам решит
      console.log('WebSocket Error', err);
    };

    socket.onmessage = (event: MessageEvent): void => {
      if (socketInstanceIdRef.current !== myId) return;
      const data = JSON.parse(event.data);
      console.log(data);
      //Cобытия:
      // 1.Подтверждает отправленние созданного исходящего сообщения в обычный чат по request_uid
      if (
        data.action === 'create_text_message' &&
        data.status === 'OK' &&
        data.object.to_user?.uid === userIdRef.current
      ) {
        console.log('Подтверждение сервера об отправке исходящего сообщения в обычный чат) :', data);
        // Если сервер пришлёт подтверждение с request_uid,
        // заменим заклушку стоящую в DOM на присланное сервером сообщение и его статус отметим как sent
        if (data.request_uid) {
          updateMessageByUidForUser(userIdRef.current, data.request_uid, { status: 'sent', ...data.object });
          // Очистим таймаут подтверждения
          pendingTimeouts.current.delete(data.request_uid);
        }
      }

      // Подтверждает отправленние созданного исходящего сообщения в группу по request_uid
      if (
        data.action === 'create_text_message' &&
        data.status === 'OK' &&
        data.object.from_user.uid === currentUserIdRef.current &&
        data.object.chat_key === userIdRef.current
      ) {
        console.log('Подтверждение сервера об отправке исходящего сообщения в группу) :', data);
        // Если сервер пришлёт подтверждение с request_uid,
        // заменим заклушку стоящую в DOM на присланное сервером сообщение и его статус отметим как sent
        if (data.request_uid) {
          updateMessageByUidForUser(userIdRef.current, data.request_uid, { status: 'sent', ...data.object });
          // Очистим таймаут подтверждения
          pendingTimeouts.current.delete(data.request_uid);
        }
      }

      // 2. Не подтверждает отправленние созданного исходящего сообщения по request_uid
      if (data.action === 'create_text_message' && data.status === 'error') {
        updateMessageByUidForUser(userIdRef.current, data.request_uid, { status: 'failed' });
        // Очистим таймаут подтверждения
        pendingTimeouts.current.delete(data.request_uid);
        console.error('Ошибка, исходящее сообщение не прошло):', data.error);
      }

      //  3. Поступило входящее c обычного чата сообщение
      if (
        data.action === 'create_text_message' &&
        data.status === 'OK' &&
        data.object.to_user?.uid === currentUserIdRef.current
      ) {
        console.log('Получили входящее сообщение c обычного чата) :', data);
        // добавляем входящее сообщение в {store} в массив с ключом userId===data.object.from_user.uid
        // (это id лица отправивщего входящее сообщение)
        const fromUserUid = data.object.from_user.uid;
        const serverMessage = { ...data.object, status: 'sent' };
        upsertMessageForUser(fromUserUid, serverMessage);
      }
      //  Поступило входящее сообщение c группы
      if (
        data.action === 'create_text_message' &&
        data.status === 'OK' &&
        data.object.from_user?.uid !== currentUserIdRef.current
      ) {
        console.log('Получили входящее сообщение с группы) :', data);
        // добавляем входящее сообщение в {store} в массив с ключом userId===data.object.from_user.uid
        // (это id группы отправившей входящее сообщение)
        const fromUserUid = data.object.chat_key;
        const serverMessage = { ...data.object, status: 'sent' };
        upsertMessageForUser(fromUserUid, serverMessage);
      }

      //4. входящее ws-сообщение read-status поступило отправителю первоначального исходящего текстового сообщения в обычном чате
      if (
        data.action === 'change_status_read_message' &&
        data.status === 'OK' &&
        data.object.from_user.uid === currentUserIdRef.current
      ) {
        console.log('Подтверждение об изменения read-status исходящего сообщения обычного чата :', data);
        // в store находим нужное первоначальное исходящее {текстовое сообщение} в котором свойство new меняем на false
        updateMessageByUidForUser(data.object.to_user.uid, data.object.uid, { status: 'read', new: false });
      }
      //Входящее ws-сообщение read-status поступило отправителю первоначального исходящего текстового сообщения в группе
      if (
        data.action === 'change_status_read_message' &&
        data.status === 'OK' &&
        data.object.from_user.uid === currentUserIdRef.current &&
        data.object.chat_data.chat_key === userIdRef.current
      ) {
        console.log('Подтверждение об изменения read-status исходящего сообщения группы :', data);
        // в store находим нужное первоначальное исходящее {текстовое сообщение} в котором свойство new меняем на false
        updateMessageByUidForUser(data.object.chat_data.chat_key, data.object.uid, { status: 'read', new: false });
      }

      //5. Bходящее ws-сообщение read-status поступило получателю первоначального входящего текстового сообщения в обычтом счате
      if (
        data.action === 'change_status_read_message' &&
        data.status === 'OK' &&
        data.object.to_user.uid === currentUserIdRef.current
      ) {
        console.log('Подтверждение об изменении read-status входящего сообщения обычного чата :', data);
        updateMessageByUidForUser(data.object.from_user.uid, data.object.uid, { status: 'read', new: false });
        pendingTimeouts.current.delete(data.request_uid);
      }
      // Входящее ws-сообщение read-status поступило получателю первоначального входящего текстового сообщения в группе
      if (
        data.action === 'change_status_read_message' &&
        data.status === 'OK' &&
        data.object.to_user.uid === userIdRef.current.replace('group_', '')
      ) {
        console.log('Подтверждение об изменении read-status входящего сообщения группы:', data);
        updateMessageByUidForUser(data.object.chat_data.chat_key, data.object.uid, { status: 'read', new: false });
        pendingTimeouts.current.delete(data.request_uid);
      }

      //6.входящее ws-сообщение delete_message oб удалении входящего сообщения
      if (
        data.action === 'delete_message' &&
        data.status === 'OK'
        //data.object.to_user.uid === currentUserIdRef.current
      ) {
        console.log('Cообщение сервера об удалении входящего либо исходящего сообщения :', data);
        // локально удаляем сообщение из store и сразу его отсутствие показываем в DOM
        if (data.object.from_user.uid === currentUserIdRef.current) {
          deleteMessageByUidForUser(data.object.to_user.uid, data.object.uid);
        } else {
          deleteMessageByUidForUser(data.object.from_user.uid, data.object.uid);
        }
        pendingTimeouts.current.delete(data.request_uid);
      }
    };
  }, [wsUrl, addMessageForUser, updateMessageByUidForUser, upsertMessageForUser, deleteMessageByUidForUser]);

  // чтобы scheduleReconnect мог вызывать connectWS
  useEffect(() => {
    // подписки на offline/online
    const onOnline = (): void => {
      // при появлении сети — попытка подключения
      reconnectAttemptRef.current = 0;
      clearReconnectTimer();
      connectWS();
    };

    const onOffline = (): void => {
      // при offline — закрыть и не спамить reconnect-ом
      clearReconnectTimer();
      wsRef.current?.close();
    };

    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    // старт
    connectWS();
    return (): void => {
      isUnmountedRef.current = true;
      clearReconnectTimer();
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
      wsRef.current?.close();
      pendingTimeouts.current.forEach((id) => clearTimeout(id));
      pendingTimeouts.current.clear();
    };
  }, [connectWS]);

  // Функция отправки сообщения
  const sendMessage = useCallback(
    (
      content: string,
      repliedMessageStore?: RestMessageApi | null | undefined,
      forwardMessageStore?: RestMessageApi | null | undefined,
    ): void => {
      if (!content.trim()) return;
      const requestUid = crypto.randomUUID();

      // выясняем это простой чат либо группа (если true то группа)
      const has = userIdRef.current.includes('group_');
      //создаем в DOM временное сообщение-заглушку для помещения в список сообщений
      const tempMessage: RestMessageApi & { status?: 'pending' | 'sent' | 'failed' | 'read' } = {
        id: 0,
        uid: requestUid,
        from_user: {
          uid: '',
          username: '',
          nickname: '',
          avatar_url: '',
          avatar_webp_url: '',
        },
        to_user: {
          uid: has ? '' : userIdRef.current,
          username: '',
          nickname: '',
          avatar_url: '',
          avatar_webp_url: '',
        },
        content,
        replied_messages: [],
        forwarded_messages: [],
        files_list: [],
        new: true,
        created_at: Date.now() / 1000,
        updated_at: 0,
        chat_id: 0,
        chat_key: has ? userIdRef.current : '',
        chat_type: '',
        message_rtc: {
          uid: '',
          duration: 0,
          status: '',
          updated_at: 0,
          created_at: 0,
        },
        status: 'pending',
      };
      if (repliedMessageStore) {
        tempMessage.replied_messages = [
          {
            id: repliedMessageStore.id,
            uid: repliedMessageStore.uid,
            is_deleted: false,
            from_user: repliedMessageStore.from_user.uid,
            first_name: repliedMessageStore.from_user.first_name ?? '',
            last_name: repliedMessageStore.from_user.last_name ?? '',
            content: repliedMessageStore.content,
            files_list: [],
          },
        ];
      }
      if (forwardMessageStore) {
        tempMessage.forwarded_messages = [
          {
            id: forwardMessageStore.id,
            uid: forwardMessageStore.uid,
            is_deleted: false,
            from_user: forwardMessageStore.from_user.uid,
            first_name: forwardMessageStore.from_user.first_name ?? '',
            last_name: forwardMessageStore.from_user.last_name ?? '',
            content: forwardMessageStore.content,
            files_list: [],
            avatar_webp_url: forwardMessageStore.from_user.avatar_webp_url,
          },
        ];
      }
      // записываем в store и показываем локально сразу в DOM созданное клиентом сообщение (tempMessage)

      addMessageForUser(userIdRef.current, tempMessage);

      // Отправляем через WS созданное клиентом сообщение (payloadMessage) (если соединение есть)
      const payloadMessage: CreateTextMessageAPI = {
        action: 'create_text_message',
        request_uid: requestUid,
        object: {
          content,
          status: 'publish',
          replied_messages: [],
          forwarded_messages: [],
        },
      };

      if (repliedMessageStore) {
        payloadMessage.object.replied_messages = [repliedMessageStore.uid];
      }
      if (forwardMessageStore) {
        payloadMessage.object.forwarded_messages = [forwardMessageStore.uid];
      }
      if (has) {
        payloadMessage.object.chat_key = userIdRef.current;
      } else {
        payloadMessage.object.to_user_uid = userIdRef.current;
      }

      //валидация c помощью zod
      const resultZod = serializerRequestCreatingMessageApiSchema.safeParse(payloadMessage);

      const socket = wsRef.current;
      if (socket && socket.readyState === WebSocket.OPEN && resultZod.success) {
        socket.send(JSON.stringify(payloadMessage));
        console.log('Send of server message: ', payloadMessage);
        //Устанавливаем таймаут ожидания подтверждения (10cek)
        const to = setTimeout(() => {
          // Если за 10 cек не пришло сообщение-подтверждение от ws меняем в сообщении
          //  статус с 'pending' на 'failed' - {status:failed}
          updateMessageByUidForUser(userIdRef.current, requestUid, { status: 'failed' });
          pendingTimeouts.current.delete(requestUid);
        }, 5000);
        pendingTimeouts.current.set(requestUid, to);
      } else {
        // Если socket не готов отправить на сервер созданное клиентом сообщение, тогда в данном сообщении сразу меняем
        //  статус с 'pending' на 'failed' - {status:failed}.
        updateMessageByUidForUser(userIdRef.current, requestUid, { status: 'failed' });
      }
    },
    [addMessageForUser, updateMessageByUidForUser, userIdRef],
  );

  // Пересылка профиля из страницы инфо
  const sendProfile = (payload: CreateTextMessageAPI): void => {
    const resultZod = serializerRequestCreatingMessageApiSchema.safeParse(payload);

    const socket = wsRef.current;
    if (socket && socket.readyState === WebSocket.OPEN && resultZod.success) {
      socket.send(JSON.stringify(payload));
      console.log('Send of server profile: ', payload);
    }
  };

  // Функция отправки сообщения на изменение статуса прочитки входящего сообщения
  const sendChangeStatusReadMessage = useCallback(
    (message: RestMessageApi & { status?: 'pending' | 'sent' | 'failed' | 'read' }): void => {
      if (!message.uid || message.new === false) return;
      const requestUid = crypto.randomUUID();
      // выясняем это простой чат либо группа (если true то группа)
      const has = userIdRef.current.includes('group_');
      // Отправляем через WS созданное клиентом сообщение (payloadMessage) (если соединение есть)
      const payloadMessage: ChangeStatusReadMessageAPI = {
        action: 'change_status_read_message',
        request_uid: requestUid,
        object: {
          uid: message.uid,
          reader_uid: currentUserIdRef.current,
          new_read_status: false,
        },
      };
      if (has) {
        payloadMessage.object.chat_key = userIdRef.current;
      }
      //валидация c помощью zod
      const resultZod = serializerRequestChangeStatusReadMessageApiSchema.safeParse(payloadMessage);
      updateMessageByUidForUser(message.from_user.uid, message.uid, { status: 'read', new: false });
      const socket = wsRef.current;
      if (socket && socket.readyState === WebSocket.OPEN && resultZod.success) {
        //отправляем запрос
        socket.send(JSON.stringify(payloadMessage));
        console.log('Send of server change-status-read-message: ', payloadMessage);
        const to = setTimeout(() => {
          // Если за 5 cек не пришло сообщение-подтверждение от ws,
          //  направляем повторно send ws-сообщение
          socket.send(JSON.stringify(payloadMessage));
          pendingTimeouts.current.delete(requestUid);
        }, 5000);
        pendingTimeouts.current.set(requestUid, to);
      }
    },
    [wsRef, updateMessageByUidForUser],
  );

  // Функция удаления сообщения
  const sendDeleteMessage = useCallback(
    (message: RestMessageApi & { status?: 'pending' | 'sent' | 'failed' | 'read' }, for_all?: boolean | null): void => {
      //console.log('Start: ', for_all);
      if (!message.uid) return;
      const requestUid = crypto.randomUUID();
      // Отправляем через WS созданное клиентом сообщение (payloadMessage) (если соединение есть)
      const payloadMessage: DeleteMessageApi = {
        action: 'delete_message',
        request_uid: requestUid,
        object: {
          uid: message.uid,
          for_all: for_all ?? false,
          //chat_key: '',
        },
      };
      //валидация c помощью zod
      const resultZod = serializerRequestDeleteMessageApiSchema.safeParse(payloadMessage);
      // локально удаляем сообщение из store и сразу его отсутствие показываем в DOM
      deleteMessageByUidForUser(userIdRef.current, message.uid);
      const socket = wsRef.current;
      if (socket && socket.readyState === WebSocket.OPEN && resultZod.success) {
        //отправляем запрос
        socket.send(JSON.stringify(payloadMessage));
        console.log('Send of server delete-message: ', payloadMessage);
        const to = setTimeout(() => {
          // Если за 5 cек не пришло сообщение-подтверждение от ws,
          //  направляем повторно send ws-сообщение
          socket.send(JSON.stringify(payloadMessage));
          pendingTimeouts.current.delete(requestUid);
        }, 5000);
        pendingTimeouts.current.set(requestUid, to);
      }
    },
    [wsRef, userIdRef, deleteMessageByUidForUser],
  );

  return {
    sendMessage,
    sendProfile,
    sendChangeStatusReadMessage,
    sendDeleteMessage,
  };
}
