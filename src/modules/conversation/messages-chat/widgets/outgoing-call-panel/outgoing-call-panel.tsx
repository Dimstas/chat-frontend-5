import clsx from 'clsx';
import { useChatsScreen } from 'modules/conversation/chats/screens/use-chats-screen';
import { useCallsStore } from 'modules/conversation/messages-chat/model/calls/calls.store';
import { usePathname } from 'next/navigation';
import { JSX } from 'react';
import { ImageUI } from 'shared/ui';
import CallEndIcon from '../../shared/icons/close.svg';
import CloseScreenIcon from '../../shared/icons/closescreen.svg';
import FullScreenIcon from '../../shared/icons/fullscreen.svg';
import MicroIcon from '../../shared/icons/micro.svg';
import VideoIcon from '../../shared/icons/video.svg';
import styles from './outgoing-call-panel.module.scss';

export const OutgoingCallPanel = (): JSX.Element | null => {
  const { isFullScreen, toggleFullScreen, toggleCallsOpen } = useCallsStore();
  const { chats } = useChatsScreen();
  const pathname = usePathname();
  const arr = pathname.split('/');
  const uid = arr[arr.length - 1];
  const chat = chats.find((c) => c.peer.uid === uid);
  const { avatarUrl, firstName, lastName } = chat?.peer ?? {};

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
          alt={chat?.chat.name ?? ''}
          className={styles.avatar}
        />
        <div className={styles.description}>
          <div className={styles.contact}>{`${firstName} ${lastName}`}</div>
          <div className={styles.state}>Звонок...</div>
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
