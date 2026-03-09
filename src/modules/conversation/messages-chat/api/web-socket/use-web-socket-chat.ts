'use client';

import { useCallback, useEffect, useRef } from 'react';
import type { ChangeStatusReadMessageAPI, CreateTextMessageAPI, RestMessageApi } from '../../model/messages-list';
import {
  serializerRequestChangeStatusReadMessageApiSchema,
  serializerRequestCreatingMessageApiSchema,
} from '../../model/messages-list';
import { useMessagesChatStore, useUserIdStore } from '../../zustand-store/zustand-store';

type UseWebSocketChat = {
  sendMessage: (content: string) => void;
  sendChangeStatusReadMessage: (message: RestMessageApi & { status?: 'pending' | 'sent' | 'failed' | 'read' }) => void;
};

export function useWebSocketChat(wsUrl: string): UseWebSocketChat {
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
  const currentUserIdRef = useRef<string>('');
  // установим начальныe значения сообщений из чатов, если пришёл user_uid с сервера
  const addMessageForUser = useMessagesChatStore.getState().addMessageForUser;
  const updateMessageByUidForUser = useMessagesChatStore.getState().updateMessageByUidForUser;
  const upsertMessageForUser = useMessagesChatStore.getState().upsertMessageForUser;

  //Функция для переподключения ws-coeдинения
  const connectWSRef = useRef<() => void>(() => {});
  // maccив интервалов [{requestUid:timeout_id},...] на каждое отправленное сообщение с помошью ws
  // нужно отследить через какое время на отправленное клиентом сообщение, ws пришлет ответ-подтверждение,
  // либо его вообще не пришлет
  const pendingTimeouts = useRef<Map<string, number | NodeJS.Timeout>>(new Map()); //
  // Функция для подключаемся к ws-соединению и регистрации ws-обработчиков

  const connectWS = useCallback(() => {
    // Закрываем старое ws подключение, если он есть
    if (wsRef.current?.readyState === WebSocket.OPEN || wsRef.current?.readyState === WebSocket.CONNECTING) {
      return;
    }
    //подключение к ws-соединению
    const socket = new WebSocket(wsUrl);
    wsRef.current = socket;
    socket.onopen = (): void => {
      console.log('WebSocket open');
    };
    socket.onclose = (): void => {
      console.log('WebSocket close');
      // переподключение через 2 сек
      setTimeout(() => connectWSRef.current(), 2000);
    };
    socket.onerror = (error: Event): void => {
      console.log('WebSocket Error: ', error);
      socket.close();
    };

    socket.onmessage = (event: MessageEvent): void => {
      const data = JSON.parse(event.data);
      console.log(data);
      // после поключения к ws по автоматическому ответу сервера получаем свой текущий user_uid
      if (data.action === 'new_status_user' && data.status === 'OK' && currentUserIdRef.current === '') {
        currentUserIdRef.current = data.object.user.uid;
      }

      //Cобытия:
      // 1.Подтверждает отправленние созданного исходящего сообщения по request_uid
      if (
        data.action === 'create_text_message' &&
        data.status === 'OK' &&
        data.object.to_user.uid === userIdRef.current
      ) {
        console.log('Подтверждение сервера об отправке исходящего сообщения) :', data);
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

      //  3. Поступило входящее сообщение
      if (
        data.action === 'create_text_message' &&
        data.status === 'OK' &&
        data.object.to_user.uid === currentUserIdRef.current
      ) {
        console.log('Получили входящее сообщение) :', data);
        // добавляем входящее сообщение в {store} в массив с ключом userId===data.object.from_user.uid
        // (это id лица отправивщего входящее сообщение)
        const fromUserUid = data.object.from_user.uid;
        const serverMessage = { ...data.object, status: 'sent' };
        upsertMessageForUser(fromUserUid, serverMessage);
        // частный случай входящего сообщения, когда пользователь мессенджера находится
        // на странице чата от которого пришло входящее сообщение
      }

      //4. входящее ws-сообщение read-status поступило отправителю первоначального исходящего текстового сообщения
      if (
        data.action === 'change_status_read_message' &&
        data.status === 'OK' &&
        data.object.from_user.uid === currentUserIdRef.current
      ) {
        console.log('Входящее сообщение об изменение read-status первоначального исходящего сообщения :', data);
        // в store находим нужное первоначальное исходящее {текстовое сообщение} в котором свойство new меняем на false
        updateMessageByUidForUser(data.object.to_user.uid, data.object.uid, { status: 'read', new: false });
      }
    };
  }, [wsUrl, updateMessageByUidForUser, upsertMessageForUser]);

  // устанавливаем ws-соединение
  useEffect(() => {
    connectWSRef.current = connectWS;
    connectWS();
    return (): void => {
      // при следующем эффекте (когда изменется функция connectWS())
      // закрываем ws-соединение и очищаем все созданные таймауты
      //wsRef.current?.close();
      pendingTimeouts.current.forEach((id) => clearTimeout(id));
      pendingTimeouts.current.clear();
    };
  }, [connectWS]);

  // Функция отправки сообщения
  const sendMessage = useCallback(
    (content: string): void => {
      if (!content.trim()) return;
      const requestUid = crypto.randomUUID();
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
          uid: userIdRef.current,
          username: '',
          nickname: '',
          avatar_url: '',
          avatar_webp_url: '',
        },
        content,
        replied_messages: [],
        forwarded_messages: [],
        files_list: [],
        new: false,
        created_at: Date.now() / 1000,
        updated_at: 0,
        chat_id: 0,
        chat_key: '',
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
      // записываем в store и показываем локально сразу в DOM созданное клиентом сообщение (tempMessage)
      addMessageForUser(userIdRef.current, tempMessage);

      // Отправляем через WS созданное клиентом сообщение (payloadMessage) (если соединение есть)
      const payloadMessage: CreateTextMessageAPI = {
        action: 'create_text_message',
        request_uid: requestUid,
        object: {
          to_user_uid: userIdRef.current,
          content,
          status: 'publish',
        },
      };
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

  // Функция отправки сообщения на изменение статуса прочитки входящего сообщения
  const sendChangeStatusReadMessage = useCallback(
    (message: RestMessageApi & { status?: 'pending' | 'sent' | 'failed' | 'read' }): void => {
      if (!message.uid || message.status === 'read') return;
      const requestUid = crypto.randomUUID();
      // Отправляем через WS созданное клиентом сообщение (payloadMessage) (если соединение есть)
      const payloadMessage: ChangeStatusReadMessageAPI = {
        action: 'change_status_read_message',
        request_uid: requestUid,
        object: {
          uid: message.uid,
        },
      };
      //валидация c помощью zod
      const resultZod = serializerRequestChangeStatusReadMessageApiSchema.safeParse(payloadMessage);
      updateMessageByUidForUser(message.from_user.uid, message.uid, { status: 'read', new: false });
      const socket = wsRef.current;
      if (socket && socket.readyState === WebSocket.OPEN && resultZod.success) {
        //отправляем запрос
        socket.send(JSON.stringify(payloadMessage));
        console.log('Send of server change-status-read-message: ', payloadMessage);
      }
    },
    [wsRef, updateMessageByUidForUser],
  );

  return {
    sendMessage,
    sendChangeStatusReadMessage,
  };
}
