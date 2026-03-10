'use client';
import { JSX, useEffect, useMemo, useRef, useState } from 'react';
import { useWebSocketChat } from '../../api/web-socket/use-web-socket-chat';
import { useIntersectionRead } from '../../hooks/use-intersection-read';
import { handlerMessagesList } from '../../lib/handler-messages-list';
import type { RestMessageApi } from '../../model/messages-list';
import { useMessagesChatStore, useUserIdStore } from '../../zustand-store/zustand-store';
import { DateCard } from '../date-card/date-card';
import { IncomingMessagesCard } from '../message-card/incoming-message-card/incoming-message-card';
import { OutgoingMessagesCard } from '../message-card/outgoing-message-card/outgoing-message-card';
import styles from './message-list.module.scss';

export const MessagesList = ({
  messagesList,
  wsUrl,
  currentUserId,
}: {
  messagesList: RestMessageApi[];
  wsUrl: string;
  currentUserId: string;
}): JSX.Element => {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const targetItemRef = useRef<HTMLDivElement | null>(null);
  const userIdStore = useUserIdStore((s) => s.userId);
  const messagesByUser = useMessagesChatStore((s) => s.messagesByUser[userIdStore]);
  const setMessagesForUser = useMessagesChatStore((s) => s.setMessagesForUser);
  const [hasScrolledToTarget, setHasScrolledToTarget] = useState(false);

  useEffect(() => {
    if (!userIdStore) return;
    const normalized = messagesList.map((m) => ({ ...m, status: 'sent' as const }));
    setMessagesForUser(userIdStore, normalized);
  }, [messagesList, userIdStore, setMessagesForUser]);

  const { results, messagesLength } = useMemo(() => {
    const messages = messagesByUser ?? [];
    console.log(messages);
    return { results: handlerMessagesList(messages), messagesLength: messages.length };
  }, [messagesByUser]);

  // Соберём flat-список в порядке рендера
  const dateKeysInRenderOrder = Object.keys(results).reverse();
  const flatList: Array<{
    date: string;
    message: RestMessageApi & { status?: 'pending' | 'sent' | 'failed' | 'read' };
  }> = [];
  dateKeysInRenderOrder.forEach((date) => {
    const msgs = results[date] ?? [];
    msgs
      .slice()
      .reverse()
      .forEach((m) => flatList.push({ date, message: m }));
  });

  // вычисляем targetIndex: первого непрочитанного входящего, иначе последний элемент
  const targetIndex = useMemo(() => {
    const keys = Object.keys(results).reverse();
    const ordered: Array<RestMessageApi & { status?: 'pending' | 'sent' | 'failed' | 'read' }> = [];
    keys.forEach((date) => {
      const msgs = results[date] ?? [];
      msgs
        .slice()
        .reverse()
        .forEach((m) => ordered.push(m));
    });
    if (!ordered.length) return -1;
    const firstUnreadIncoming = ordered.findIndex((m) => m.to_user.uid === currentUserId && m.new === true);
    if (firstUnreadIncoming !== -1) return firstUnreadIncoming;
    return ordered.length - 1;
  }, [results, currentUserId]);

  // хук ws + hook для определения прочтения видимости
  const { sendChangeStatusReadMessage } = useWebSocketChat(wsUrl, currentUserId);
  const { register } = useIntersectionRead(sendChangeStatusReadMessage);

  // Эффект прокрутки к targetIndex (если есть)
  useEffect(() => {
    if (targetIndex === -1) return;
    if (hasScrolledToTarget) return; // уже скроллили — больше не трогаем
    const el = targetItemRef.current;
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [results, messagesLength, targetIndex]);

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      {dateKeysInRenderOrder.map<JSX.Element>((date: string) => (
        <div key={date}>
          <DateCard date={date} />
          {results[date]
            .slice()
            .reverse()
            .map<JSX.Element>(
              (message: RestMessageApi & { status?: 'pending' | 'sent' | 'failed' | 'read' }, index) => {
                // вычисляем globalIndex
                const dateIndex = dateKeysInRenderOrder.indexOf(date);
                let globalIndex = 0;
                for (let i = 0; i < dateIndex; i++) {
                  const d = dateKeysInRenderOrder[i];
                  globalIndex += (results[d] ?? []).length;
                }
                globalIndex += index;
                const isTarget = globalIndex === targetIndex;
                return (
                  <div key={globalIndex} tabIndex={-1} ref={isTarget ? targetItemRef : undefined}>
                    {message.from_user.uid === userIdStore ? (
                      <IncomingMessagesCard message={message} register={register} />
                    ) : (
                      <OutgoingMessagesCard message={message} />
                    )}
                  </div>
                );
              },
            )}
        </div>
      ))}
    </div>
  );
};
