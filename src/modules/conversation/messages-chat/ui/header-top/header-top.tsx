'use client';
import { useChatsScreen } from 'modules/conversation/chats/screens/use-chats-screen';
import { useInfoStore } from 'modules/info/model/info.store';
import { JSX } from 'react';
import { getLastSeenLabel } from 'shared/libs';
import { ImageUI } from 'shared/ui/image';
import { HeaderTopButtonsBlock } from '../header-top-buttons-block/header-top-buttons-block';
import styles from './header-top.module.scss';
import CallIcon from './icons/call-icon.svg';
import SearchIcon from './icons/search-icon.svg';
const URL_DEFAULT_Avatar = '/images/messages-chats/default-avatar.svg';

export const HeaderTop = ({ user_uid }: { user_uid: string }): JSX.Element => {
  const { chats } = useChatsScreen();
  const { toggleInfoOpen } = useInfoStore();

  const chat = chats.find((c) => c.peer.uid === user_uid);
  const { avatarUrl = '', firstName = '', lastName = '', wasOnlineAt = null } = chat?.peer ?? {};
  const status = getLastSeenLabel(wasOnlineAt);

  return (
    <div className={styles.wrapper}>
      <div className={styles.contactWrapper}>
        <ImageUI
          src={avatarUrl ? avatarUrl : URL_DEFAULT_Avatar}
          alt={firstName}
          width={40}
          height={40}
          className={styles.image}
        />
        <div className={styles.info}>
          <span className={styles.name}>{firstName + ' ' + lastName}</span>
          <span className={styles.status}>{status}</span>
        </div>
        <div className={styles.icon}>
          <button onClick={() => toggleInfoOpen()}>
            <SearchIcon />
          </button>
        </div>
        <div className={styles.icon}>
          <button>
            <CallIcon />
          </button>
        </div>
      </div>
      <HeaderTopButtonsBlock />
    </div>
  );
};
