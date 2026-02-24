'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { apiFetch } from 'shared/api';
import type { CreateTextMessageAPI } from '../../model/messages-list';

const MAX_RECONNECT_COUNT = 3;
type UseWebSocketChat = {
  sendMessage: (content: string, to_user_uid: string) => void;
  message: CreateTextMessageAPI | null;
  error: string | null;
};

export function useWebSocketChat(): UseWebSocketChat {
  // Ссылка на websocket подключение
  const wsRef = useRef<WebSocket | null>(null);
  // ссылка для переподключения, чтобы не плодить кучу подключений
  const reconnectRef = useRef<() => void>(() => {});
  // кол-во попыток переподключения, чтобы не делать это бесконечно
  const reconnectCountRef = useRef<number>(0);
  // сообщения для отправки на сервер от клиента
  const [message, setMessage] = useState<CreateTextMessageAPI | null>(null);
  // сообщение об ошибке
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // открываем ws соединение
    const connectWS = async (): Promise<void> => {
      const socket = await apiFetch<WebSocket>(`/api/proxy`, {
        method: 'SEND',
      });
      wsRef.current = socket;

      socket.onopen = (): void => {
        console.log('WebSocket open');
        reconnectCountRef.current = 0;
      };

      socket.onclose = (): void => {
        console.log('WebSocket close');
      };

      socket.onerror = (error: Event): void => {
        setError(`${error}`);
        console.log('WebSocket Error: ', error);
        if (reconnectCountRef.current < MAX_RECONNECT_COUNT) {
          reconnectCountRef.current += 1;
          setTimeout(() => {
            reconnectRef.current();
          }, 3000);
        }
      };

      // socket.onmessage = (event: MessageEvent): void => {
      //   const data = JSON.parse(event.data);
      // };
    };

    reconnectRef.current = connectWS;
    connectWS();

    return (): void => {
      wsRef.current?.close();
    };
  }, []);

  // Функция отправки сообщения
  const sendMessage = useCallback((content: string, to_user_uid: string): void => {
    //const requestUid = crypto.randomUUID();

    const message: CreateTextMessageAPI = {
      action: 'create_text_message',
      //request_uid: requestUid,
      object: {
        to_user_uid,
        content,
        status: 'publish',
      },
    };
    setMessage(message);

    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current?.send(JSON.stringify(message));
      console.log('Отправили на сервер: ', message);
    }
  }, []);

  return useMemo(
    () => ({
      sendMessage,
      message,
      error,
    }),
    [sendMessage, message, error],
  );
}
