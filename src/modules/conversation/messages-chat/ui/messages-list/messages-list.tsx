'use client';
import { JSX, useEffect, useRef } from 'react';
import { handlerMessagesList } from '../../lib/handler-messages-list';
import type { RestMessageApi } from '../../model/messages-list';
import { useMessagesChatStore } from '../../zustand-store/zustand-store';
import { DateCard } from '../date-card/date-card';
import { IncomingMessagesCard } from '../message-card/incoming-message-card/incoming-message-card';
import { OutgoingMessagesCard } from '../message-card/outgoing-message-card/outgoing-message-card';
import styles from './message-list.module.scss';

export const MessagesList = ({
  user_uid,
  messagesList,
}: {
  user_uid: string;
  messagesList: RestMessageApi[];
}): JSX.Element => {
  const messagesFromStore = useMessagesChatStore((s) => s.messagesChat);
  useEffect(() => {
    console.log(messagesFromStore);
  }, [messagesFromStore]);
  // ref на контейнер и на последний элемент списка
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const lastItemRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // установим начальные сообщения, если пришёл messagesList с сервера
    const normalized = messagesList.map((m) => ({ ...m, status: 'sent' as const }));
    useMessagesChatStore.getState().setMessagesChat(normalized);
  }, [messagesList]);

  const results = handlerMessagesList(messagesFromStore);

  // Каждый раз, когда results меняется — прокручиваем к последнему сообщению
  useEffect(() => {
    const el = lastItemRef.current;
    if (!el) return;
    // Плавная прокрутка
    el.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [results, messagesFromStore.length]);
  // Для упрощения: вычислим flat-список отрендеренных сообщений и пометим последний.
  const dateKeysInRenderOrder = Object.keys(results).reverse();
  // Соберём flat-список объектов { date, message } в порядке рендера:
  const flatList: Array<{ date: string; message: RestMessageApi & { status?: 'pending' | 'sent' | 'failed' } }> = [];
  dateKeysInRenderOrder.forEach((date) => {
    const msgs = results[date] ?? [];
    msgs
      .slice()
      .reverse()
      .forEach((m) => flatList.push({ date, message: m }));
  });
  const lastIndex = flatList.length - 1;

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      {dateKeysInRenderOrder.map<JSX.Element>((date: string) => (
        <div key={date}>
          <DateCard date={date} />
          {results[date]
            .slice()
            .reverse()
            .map<JSX.Element>((message: RestMessageApi & { status?: 'pending' | 'sent' | 'failed' }, index) => {
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
                  {message.from_user.uid === user_uid ? (
                    <IncomingMessagesCard message={message} />
                  ) : (
                    <OutgoingMessagesCard message={message} />
                  )}
                </div>
              );
            })}
        </div>
      ))}
    </div>
  );
};

export default MessagesList;
