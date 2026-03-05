'use client';

import { useCallback, useEffect, useRef } from 'react';
import type { CreateTextMessageAPI, RestMessageApi } from '../../model/messages-list';
import { useMessagesChatStore, useUserIdStore } from '../../zustand-store/zustand-store';

type UseWebSocketChat = {
  sendMessage: (content: string) => void;
};

export function useWebSocketChat(wsUrl: string): UseWebSocketChat {
  // user_uid открытого чата из store
  const userIdStore = useUserIdStore.getState().userId;
  // Ссылка на websocket подключение
  const wsRef = useRef<WebSocket | null>(null);
  //ссылка на uid текущего пользователя мессенджера
  const currentUserIdRef = useRef<string>('');
  // установим начальныe значения сообщений из чатов, если пришёл user_uid с сервера
  const addMessageForUser = useMessagesChatStore.getState().addMessageForUser;
  const updateMessageByUidForUser = useMessagesChatStore.getState().updateMessageByUidForUser;
  const upsertMessageForUser = useMessagesChatStore.getState().upsertMessageForUser;
  const messagesByUser = useMessagesChatStore.getState().messagesByUser;
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
      // после поключения к ws по автоматическому ответу сервера получаем свой текущий user_uid
      if (data.action === 'new_status_user' && data.status === 'OK' && currentUserIdRef.current === '') {
        currentUserIdRef.current = data.object.user.uid;
        console.log('currentUserIdRef: ', currentUserIdRef.current);
        console.log('userIdStore: ', userIdStore);
      }

      //Cобытия:
      // 1.Подтверждает отправленние созданного исходящего сообщения по request_uid
      if (data.action === 'create_text_message' && data.status === 'OK' && data.object.to_user.uid === userIdStore) {
        console.log('Ответ ws-сервера (исходящее сообщение) :', data);
        // Если сервер пришлёт подтверждение с request_uid,
        // заменим заклушку стоящую в DOM на присланное сервером сообщение и его статус отметим как sent
        if (data.request_uid) {
          updateMessageByUidForUser(userIdStore, data.request_uid, { status: 'sent', ...data.object });
          // Очистим таймаут подтверждения
          pendingTimeouts.current.delete(data.request_uid);
        }
      }
      // 2. Не подтверждает отправленние созданного исходящего сообщения по request_uid
      if (data.action === 'create_text_message' && data.status === 'error') {
        updateMessageByUidForUser(userIdStore, data.request_uid, { status: 'failed' });
        // Очистим таймаут подтверждения
        pendingTimeouts.current.delete(data.request_uid);
        console.error('Ответ ws-сервера (исходящее сообщение не прошло):', data.error);
      }

      //  3. Поступление входящего сообщения
      if (
        data.action === 'create_text_message' &&
        data.status === 'OK' &&
        data.object.to_user.uid === currentUserIdRef.current
      ) {
        console.log('Ответ ws-сервера (входящее сообщение) :', data);
        const fromUserUid = data.object.from_user.uid;
        const serverMessage = { ...data.object, status: 'sent' };
        upsertMessageForUser(fromUserUid, serverMessage);
        console.log(`mesagess ${fromUserUid} :`, messagesByUser.fromUserUid);
        // должна быть логика по отметке колличества непрочитанных сообщений в списке чатов
      }
    };
  }, [wsUrl, updateMessageByUidForUser, upsertMessageForUser, userIdStore, messagesByUser]);

  // устанавливаем ws-соединение
  useEffect(() => {
    connectWSRef.current = connectWS;
    connectWS();
    return (): void => {
      // при следующем эффекте (когда изменется функция connectWS())
      // закрываем ws-соединение и очищаем все созданные таймауты
      wsRef.current?.close();
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
      const tempMessage: RestMessageApi & { status?: 'pending' | 'sent' | 'failed' } = {
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
          uid: userIdStore,
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
      addMessageForUser(userIdStore, tempMessage);

      // Отправляем через WS созданное клиентом сообщение (payloadMessage) (если соединение есть)
      const payloadMessage: CreateTextMessageAPI = {
        action: 'create_text_message',
        request_uid: requestUid,
        object: {
          to_user_uid: userIdStore,
          content,
          status: 'publish',
        },
      };

      const socket = wsRef.current;
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(payloadMessage));
        console.log('Send of server: ', payloadMessage);
        //Устанавливаем таймаут ожидания подтверждения (10cek)
        const to = setTimeout(() => {
          // Если за 10 cек не пришло сообщение-подтверждение от ws меняем в сообщении
          //  статус с 'pending' на 'failed' - {status:failed}
          updateMessageByUidForUser(userIdStore, requestUid, { status: 'failed' });
          pendingTimeouts.current.delete(requestUid);
        }, 5000);
        pendingTimeouts.current.set(requestUid, to);
      } else {
        // Если socket не готов отправить на сервер созданное клиентом сообщение, тогда в данном сообщении сразу меняем
        //  статус с 'pending' на 'failed' - {status:failed}.
        updateMessageByUidForUser(userIdStore, requestUid, { status: 'failed' });
      }
    },
    [addMessageForUser, updateMessageByUidForUser, userIdStore],
  );

  return {
    sendMessage,
  };
}
