'use client';
import { useUserIdStore } from 'modules/conversation/messages-chat/zustand-store/zustand-store';
import { JSX, useEffect, useRef } from 'react';
import Close from '../icons/close.svg';
import styles from './reply-to-message-card.module.scss';
import type { ReplyToMessageCardProps } from './reply-to-message-card.props';

export const ReplyToMessageCard = ({
  repliedMessageStore,
  clearRepliedMessageStore,
}: ReplyToMessageCardProps): JSX.Element => {
  const userIdStore = useUserIdStore((s) => s.userId);
  const prevUserIdRef = useRef<string | null>(userIdStore);
  //если переходим в другой чат то <ReplyToMessageCard> автоматически закрывается
  useEffect(() => {
    if (prevUserIdRef.current !== userIdStore) {
      clearRepliedMessageStore();
      prevUserIdRef.current = userIdStore;
    }
  }, [userIdStore]);

  const handleCloseClick = (): void => {
    clearRepliedMessageStore();
  };
  return (
    <div className={styles.wrapper}>
      <div className={styles.forwardBlock}>
        <div className={styles.textBlock}>
          <div className={styles.text1}>
            В ответ
            <span className={styles.text11}>
              {` ${repliedMessageStore?.from_user.first_name} ${repliedMessageStore?.from_user.last_name}`}
            </span>
          </div>
          <div className={styles.text2}> {repliedMessageStore?.content} </div>
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
