'use client';
import clsx from 'clsx';
import { JSX } from 'react';
import styles from './reply-card.module.scss';
import type { ReplyCardProps } from './reply-card.props';

export const ReplyCard = ({ message, isIncomingMessage }: ReplyCardProps): JSX.Element => {
  return (
    <div className={clsx(styles.wrapper, isIncomingMessage ? styles.incomingWrapper : styles.outgoingWrapper)}>
      <div className={styles.text1}>
        {` ${message?.replied_messages[0].first_name} ${message?.replied_messages[0].last_name}`}
      </div>
      <div className={styles.text2}> {message?.replied_messages[0].content} </div>
    </div>
  );
};
