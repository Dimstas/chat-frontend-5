'use client';
import type { Msg } from 'modules/conversation/messages-chat/zustand-store/zustand-store';
import {
  useSelectedMessageStore,
  useUserIdStore,
} from 'modules/conversation/messages-chat/zustand-store/zustand-store';
import { JSX, useEffect, useRef } from 'react';
import Close from '../icons/close.svg';
import styles from './reply-to-message-card.module.scss';

export const ReplyToMessageCard = ({ selectedMessageStore }: { selectedMessageStore: Msg | null }): JSX.Element => {
  const userIdStore = useUserIdStore((s) => s.userId);
  const prevUserIdRef = useRef<string | null>(userIdStore);

  const clearSelectedMessageStore = useSelectedMessageStore((s) => s.clearSelectedMessage);
  //если переходим в другой чат то <ReplyToMessageCard> автоматически закрывается
  useEffect(() => {
    if (prevUserIdRef.current !== userIdStore) {
      clearSelectedMessageStore();
      prevUserIdRef.current = userIdStore;
    }
  }, [userIdStore]);

  const handleCloseClick = (): void => {
    clearSelectedMessageStore();
  };
  return (
    <div className={styles.wrapper}>
      <div className={styles.forwardBlock}>
        <div className={styles.textBlock}>
          <div className={styles.text1}>
            В ответ
            <span className={styles.text11}>
              {` ${selectedMessageStore?.from_user.first_name} ${selectedMessageStore?.from_user.last_name}`}
            </span>
          </div>
          <div className={styles.text2}> {selectedMessageStore?.content} </div>
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
