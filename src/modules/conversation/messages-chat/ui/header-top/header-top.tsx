'use client';
import { useChatStore } from 'modules/conversation/chats/model/chat.store';
import { usePathname, useRouter } from 'next/navigation';
import { JSX, useState } from 'react';
import { getLastSeenLabel } from 'shared/libs';
import { ImageUI } from 'shared/ui/image';
import { HeaderTopButtonsBlock } from '../header-top-buttons-block/header-top-buttons-block';
import styles from './header-top.module.scss';
import CallIcon from './icons/call-icon.svg';
import SearchIcon from './icons/search-icon.svg';

export const HeaderTop = ({ user_uid }: { user_uid: string }): JSX.Element => {
  const pathname = usePathname();
  const router = useRouter();
  const [showInfo, setShowInfo] = useState<boolean>(true);
  const { findById, toggleSelected } = useChatStore();

  const chat = findById(user_uid);
  const { avatarUrl = '', firstName = '', lastName = '', wasOnlineAt = null } = chat?.peer ?? {};
  const status = getLastSeenLabel(wasOnlineAt);

  const handlerTopHeader = (): void => {
    if (showInfo) {
      router.push(`${pathname}/info`);
      setShowInfo(false);
    } else {
      router.push(`/chats/${user_uid}`);
      setShowInfo(true);
    }
  };
  return (
    <div className={styles.wrapper}>
      <div className={styles.contactWrapper} onClick={handlerTopHeader}>
        <ImageUI src={avatarUrl} alt={firstName} width={40} height={40} className={styles.image} />
        <div className={styles.info}>
          <span className={styles.name}>{firstName + ' ' + lastName}</span>
          <span className={styles.status}>{status}</span>
        </div>
        <div className={styles.icon}>
          <button onClick={() => toggleSelected(user_uid)}>
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
