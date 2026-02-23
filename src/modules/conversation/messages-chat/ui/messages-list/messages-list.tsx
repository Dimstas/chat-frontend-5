import { JSX } from 'react';
import type { RestMessageApi } from '../../model/messages-list';
import { DateCard } from '../date-card/date-card';
import { IncomingMessagesCard } from '../message-card/incoming-message-card/incoming-message-card';
import { OutgoingMessagesCard } from '../message-card/outgoing-message-card/outgoing-message-card';
import styles from './message-list.module.scss';

export const MessagesList = ({
  user_uid,
  results,
}: {
  user_uid: string;
  results: { [date: string]: RestMessageApi[] };
}): JSX.Element => {
  return (
    <div className={styles.wrapper}>
      {Object.keys(results).map<JSX.Element>((date: string) => (
        <div key={date}>
          <DateCard date={date} />
          {results[date].map<JSX.Element>((message: RestMessageApi, index: number) => (
            <div key={index}>
              {message.from_user.uid === user_uid ? (
                <IncomingMessagesCard message={message} />
              ) : (
                <OutgoingMessagesCard message={message} />
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
