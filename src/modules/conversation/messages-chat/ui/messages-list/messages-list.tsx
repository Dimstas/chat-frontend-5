import { JSX } from 'react';
import type { ChatResult } from '../../lib/definitions';
import { DateCard } from '../date-card/date-card';
import { IncomingMessagesCard } from '../message-card/incoming-message-card/incoming-message-card';
import { OutgoingMessagesCard } from '../message-card/outgoing-message-card/outgoing-message-card';
import styles from './message-list.module.scss';

export const MessagesList = ({ results }: { results: { [date: string]: ChatResult[] } }): JSX.Element => {
  return (
    <div className={styles.wrapper}>
      {Object.keys(results).map<JSX.Element>((date: string) => (
        <div key={date}>
          <DateCard date={date} />
          {results[date].map<JSX.Element>((message: ChatResult, index: number) => (
            <div key={index}>
              {message.from_user.nickname !== 'tz7.jdvj1evk9n_h8jb2d' ? ( //nickname клиента(наверное user_uid????????)
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
