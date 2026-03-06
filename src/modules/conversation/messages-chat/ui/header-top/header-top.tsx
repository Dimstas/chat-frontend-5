'use client';
import { useChatStore } from 'modules/conversation/chats/model/chat.store';
import { JSX } from 'react';
import { getLastSeenLabel } from 'shared/libs';
import { ImageUI } from 'shared/ui/image';
import { useUserIdStore } from '../../zustand-store/zustand-store';
import { HeaderTopButtonsBlock } from '../header-top-buttons-block/header-top-buttons-block';
import styles from './header-top.module.scss';
import CallIcon from './icons/call-icon.svg';
import SearchIcon from './icons/search-icon.svg';
const URL_DEFAUIT_Avatar = '/images/messages-chats/default-avatar.svg';

export const HeaderTop = (): JSX.Element => {
  const { findByUid, toggleInfoOpen } = useChatStore();
  const userIdStore = useUserIdStore.getState().userId;
  const chat = findByUid(userIdStore);
  const { avatarUrl = '', firstName = '', lastName = '', wasOnlineAt = null } = chat?.peer ?? {};
  const status = getLastSeenLabel(wasOnlineAt);

  return (
    <div className={styles.wrapper}>
      <div onClick={() => toggleInfoOpen()} className={styles.contactWrapper}>
        <ImageUI
          src={avatarUrl ? avatarUrl : URL_DEFAUIT_Avatar}
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
          <button>
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
