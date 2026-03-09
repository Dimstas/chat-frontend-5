'use client';
import { JSX, useEffect, useMemo, useRef } from 'react';
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
}: {
  messagesList: RestMessageApi[];
  wsUrl: string;
}): JSX.Element => {
  // ref на контейнер и на последний элемент списка
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const lastItemRef = useRef<HTMLDivElement | null>(null);
  const userIdStore = useUserIdStore((s) => s.userId);
  const messagesByUser = useMessagesChatStore((s) => s.messagesByUser[userIdStore]);

  const setMessagesForUser = useMessagesChatStore((s) => s.setMessagesForUser);
  useEffect(() => {
    if (!userIdStore) return; // защититься от пустого userId
    const normalized = messagesList.map((m) => ({ ...m, status: 'sent' as const }));
    setMessagesForUser(userIdStore, normalized);
  }, [messagesList, userIdStore, setMessagesForUser]);

  const { results, messagesLength } = useMemo(() => {
    const messages = messagesByUser ?? [];
    console.log(messages);
    return { results: handlerMessagesList(messages), messagesLength: messages.length };
  }, [messagesByUser]);

  // Каждый раз, когда results меняется — прокручиваем к последнему сообщению
  useEffect(() => {
    const el = lastItemRef.current;
    if (!el) return;
    // Плавная прокрутка
    el.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [results, messagesLength]);
  // Для упрощения: вычислим flat-список отрендеренных сообщений и пометим последний.
  const dateKeysInRenderOrder = Object.keys(results).reverse();
  // Соберём flat-список объектов { date, message } в порядке рендера:
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
  const lastIndex = flatList.length - 1;
  // хук для работы c ws в частности определяем функцию для отправки ws-сообщения чтобы изменить статус входящего сообщения на "прочитанное"
  const { sendChangeStatusReadMessage } = useWebSocketChat(wsUrl);
  //xyk для определения прочтено ли вxодящее сообщение либо нет(было ли сообщение вмонтировано (показано) в DOM либо еще нет)
  const { register } = useIntersectionRead(sendChangeStatusReadMessage);

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
                // Bычислим globalIndex как позицию в flatList, но здесь используем closure:
                // compute offset: позиция первой записи для этой date в flatList:
                const dateIndex = dateKeysInRenderOrder.indexOf(date);
                // Рассчёт globalIndex (не самый оптимальный, но понятный):
                let globalIndex = 0;
                for (let i = 0; i < dateIndex; i++) {
                  const d = dateKeysInRenderOrder[i];
                  globalIndex += (results[d] ?? []).length;
                }
                globalIndex += index; // index внутри reversed array
                const isLast = globalIndex === lastIndex;
                return (
                  <div key={globalIndex} tabIndex={-1} ref={isLast ? lastItemRef : undefined}>
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

export default MessagesList;
