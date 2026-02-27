'use client';
import { JSX, useEffect } from 'react';
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
    // установим начальные сообщения, если пришёл messagesList с сервера
    const normalized = messagesList.map((m) => ({ ...m, status: 'sent' as const }));
    useMessagesChatStore.getState().setMessagesChat(normalized);
  }, [messagesList]);
  const results = handlerMessagesList(messagesFromStore);
  return (
    <div className={styles.wrapper}>
      {Object.keys(results).map<JSX.Element>((date: string) => (
        <div key={date}>
          <DateCard date={date} />
          {results[date].map<JSX.Element>(
            (message: RestMessageApi & { status?: 'pending' | 'sent' | 'failed' }, index) => (
              <div key={index}>
                {message.from_user.uid === user_uid ? (
                  <IncomingMessagesCard message={message} />
                ) : (
                  <OutgoingMessagesCard message={message} />
                )}
              </div>
            ),
          )}
        </div>
      ))}
    </div>
  );
};
