import { JSX } from 'react';
import { MessageInput } from '../message-input/message-input';
import styles from './header-bottom.module.scss';
import ClipIcon from './icon/clip.svg';
import MicIcon from './icon/mic.svg';

export const HeaderBottom = ({ user_uid }: { user_uid: string }): JSX.Element => {
  return (
    <div className={styles.wrapper}>
      <span className={styles.clipIcon}>
        <button>
          <ClipIcon />
        </button>
      </span>
      <MessageInput user_uid={user_uid} />
      <span className={styles.micIcon}>
        <button>
          <MicIcon />
        </button>
      </span>
    </div>
  );
};
