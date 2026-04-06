'use client';
import { JSX } from 'react';
import Close from '../icons/close.svg';
import styles from './forward-message-card.module.scss';
import type { ForwardMessageCardProps } from './forward-message-card.props';

export const ForwardMessageCard = ({
  forwardMessageStore,
  clearForwardMessageStore,
}: ForwardMessageCardProps): JSX.Element => {
  const handleCloseClick = (): void => {
    clearForwardMessageStore();
  };
  return (
    <div className={styles.wrapper}>
      <div className={styles.forwardBlock}>
        <div className={styles.textBlock}>
          <div className={styles.text1}>Переслать сообщение</div>
          <div className={styles.text2}>
            {` ${forwardMessageStore?.from_user.first_name} ${forwardMessageStore?.from_user.last_name}: ${forwardMessageStore?.content}`}
          </div>
        </div>
        <div className={styles.icon}>
          <button onClick={handleCloseClick}>
            <Close />
          </button>
        </div>
      </div>
    </div>
  );
};
