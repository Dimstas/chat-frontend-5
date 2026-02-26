'use client';

import { useCallback, useEffect, useRef } from 'react';
import type { CreateTextMessageAPI, RestMessageApi } from '../../model/messages-list';
import { useMessagesChatStore } from '../../zustand-store/zustand-store';

type UseWebSocketChat = {
  sendMessage: (content: string) => void;
};

export function useWebSocketChat(user_uid: string, wsUrl: string): UseWebSocketChat {
  const addMessageChat = useMessagesChatStore((s) => s.addMessageChat);
  const updateMessageByUidChat = useMessagesChatStore((s) => s.updateMessageByUidChat);
  const upsertMessageChat = useMessagesChatStore((s) => s.upsertMessageChat);

  // изначально копируем лист сообщений поступивший с сервера и помечаем каждое {status:sent}
  // const messagesChatStore = useMessagesChatStore((s) => s.messagesChat);
  // const messagesDefault: (RestMessageApi & { status?: 'pending' | 'sent' | 'failed' })[] = messagesChatStore.map(
  //   (m) => ({
  //     ...m,
  //     status: 'sent',
  //   }),
  // );
  // полный список сообщений для показа в DOM, полученные изначально с сервера
  // и полученные на клиенте с помощью ws
  // const [messages, setMessages] =
  //   useState<(RestMessageApi & { status?: 'pending' | 'sent' | 'failed' })[]>(messagesDefault);
  // Ссылка на websocket подключение
  const wsRef = useRef<WebSocket | null>(null);
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
      if (data.action === 'create_text_message') {
        console.log('Response of server:  ', data);
      }
    };
  }, [wsUrl, updateMessageByUidChat, upsertMessageChat]);
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
          uid: user_uid,
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
        created_at: Number(new Date()),
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
      // Показываем локально сразу в DOM созданное клиентом сообщение (tempMessage)
      addMessageChat(tempMessage);
      // setMessages((prev) => {
      //   return [tempMessage, ...prev];
      // });

      // Отправляем через WS созданное клиентом сообщение (payloadMessage) (если соединение есть)
      const payloadMessage: CreateTextMessageAPI = {
        action: 'create_text_message',
        request_uid: requestUid,
        object: {
          to_user_uid: user_uid,
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
          updateMessageByUidChat(requestUid, { status: 'failed' });

          pendingTimeouts.current.delete(requestUid);
        }, 10000);
        pendingTimeouts.current.set(requestUid, to);
      } else {
        // Если socket не готов отправить на сервер созданное клиентом сообщение, тогда в данном сообщении сразу меняем
        //  статус с 'pending' на 'failed' - {status:failed}.
        //setMessages((prev) => prev.map((m) => (m.uid === requestUid ? { ...m, status: 'failed' } : m)));
        updateMessageByUidChat(requestUid, { status: 'failed' });
      }
    },
    [addMessageChat, updateMessageByUidChat, user_uid],
  );

  return {
    sendMessage,
  };
}
