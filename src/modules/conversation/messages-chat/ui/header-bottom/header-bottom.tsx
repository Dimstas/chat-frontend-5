'use client';
import { JSX } from 'react';
import { useMessagesListScreen } from '../../screens';
import { MessageInput } from '../message-input/message-input';
import styles from './header-bottom.module.scss';
import ClipIcon from './icon/clip.svg';
import MicIcon from './icon/mic.svg';

export const HeaderBottom = ({ user_uid, wsUrl }: { user_uid: string; wsUrl: string }): JSX.Element => {
  const { status } = useMessagesListScreen(user_uid);
  if (status === 'success') {
    return (
      <div className={styles.wrapper}>
        <span className={styles.clipIcon}>
          <button>
            <ClipIcon />
          </button>
        </span>
        <MessageInput user_uid={user_uid} wsUrl={wsUrl} />
        <span className={styles.micIcon}>
          <button>
            <MicIcon />
          </button>
        </span>
      </div>
    );
  } else {
    return <></>;
  }
};
