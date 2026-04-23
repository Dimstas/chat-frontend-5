import clsx from 'clsx';
import { useCallsStore } from 'modules/conversation/messages-chat/model/calls/calls.store';
import { JSX } from 'react';
import { ImageUI } from 'shared/ui';
import CallEndIcon from '../../shared/icons/close.svg';
import CloseScreenIcon from '../../shared/icons/closescreen.svg';
import FullScreenIcon from '../../shared/icons/fullscreen.svg';
import MicroIcon from '../../shared/icons/micro.svg';
import VideoIcon from '../../shared/icons/video.svg';
import styles from './outgoing-call-panel.module.scss';

type OutgoingCallPanelProps = {
  avatarUrl?: string;
  contact: string;
};

export const OutgoingCallPanel = ({ avatarUrl, contact }: OutgoingCallPanelProps): JSX.Element | null => {
  const { isFullScreen, toggleFullScreen, toggleCallsOpen } = useCallsStore();

  const URL_DEFAULT_AVATAR = '/images/profile/default.png';

  return (
    <div className={clsx(styles.wrapper, { [styles.fullScreen]: isFullScreen })}>
      <div className={styles.headerButtons}>
        <button onClick={toggleFullScreen}>
          <FullScreenIcon />
        </button>
        <button onClick={toggleCallsOpen}>
          <CloseScreenIcon />
        </button>
      </div>
      <div className={styles.info}>
        <ImageUI
          src={avatarUrl ?? URL_DEFAULT_AVATAR}
          width={160}
          height={160}
          alt={contact}
          className={styles.avatar}
        />
        <div className={styles.description}>
          <div className={styles.contact}>{contact}</div>
          <div className={styles.state}>
            <p>Звонок</p>
            <div className={styles.callAnimation}>
              <div className={styles.dot}></div>
              <div className={styles.dot}></div>
              <div className={styles.dot}></div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.footerButtons}>
        <button className={styles.actionButton}>
          <VideoIcon />
          <p className={styles.buttonText}>Видео</p>
        </button>
        <button className={styles.actionButton}>
          <MicroIcon />
          <p className={styles.buttonText}>Убрать звук</p>
        </button>
        <button className={styles.actionButton}>
          <CallEndIcon />
          <p className={styles.buttonText}>Завершить</p>
        </button>
      </div>
    </div>
  );
};
