import type { ChatResult } from 'modules/conversation/messages-chat/lib/definitions';
import { getMessageTime } from 'modules/conversation/messages-chat/lib/get-message-time';
import { JSX } from 'react';
import styles from './incoming-message-card.module.scss';

export const IncomingMessagesCard = ({ message }: { message: ChatResult }): JSX.Element => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.item}>
        <div className={styles.message}>
          <span className={styles.messageText}> {message.content} </span>
          <div className={styles.messageSentTime}>
            <div className={styles.messageTime}> {getMessageTime(message.created_at)} </div>
          </div>
        </div>
      </div>
    </div>
  );
};
