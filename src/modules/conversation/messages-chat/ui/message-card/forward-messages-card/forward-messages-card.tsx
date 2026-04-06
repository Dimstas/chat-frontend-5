'use client';
import { formatMessages } from 'modules/conversation/messages-chat/utils/format-messages';
import { JSX } from 'react';
import Close from '../icons/close.svg';
import styles from './forward-messages-card.module.scss';
import type { ForwardMessagesCardProps } from './forward-messages-card.props';

export const ForwardMessagesCard = ({
  selectedMessagesStore,
  clearSelectedMessagesStore,
}: ForwardMessagesCardProps): JSX.Element => {
  const uniqueFromUser = [...new Set(selectedMessagesStore?.map((m) => m.from_user))];
  const handleCloseClick = (): void => {
    clearSelectedMessagesStore();
  };
  return (
    <div className={styles.wrapper}>
      <div className={styles.forwardBlock}>
        <div className={styles.textBlock}>
          <div className={styles.text1}>{`Переслать ${formatMessages(selectedMessagesStore?.length ?? 0)}`}</div>
          <div className={styles.text2}>{`От ${uniqueFromUser.forEach((m) => `${m.first_name} ${m.last_name}`)}`}</div>
        </div>
        <button onClick={handleCloseClick}>
          <div className={styles.icon}>
            <Close />
          </div>
        </button>
      </div>
    </div>
  );
};
