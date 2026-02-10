'use client';
import { usePathname, useRouter } from 'next/navigation';
import { JSX, useState } from 'react';
import { getLastSeenLabel } from 'shared/libs';
import { ImageUI } from 'shared/ui/image';
import { getChatById } from '../../utils/get-chat-by-id';
import { HeaderTopButtonsBlock } from '../header-top-buttons-block/header-top-buttons-block';
import styles from './header-top.module.scss';
import CallIcon from './icons/call-icon.svg';
import SearchIcon from './icons/search-icon.svg';

export const HeaderTop = ({ user_uid }: { user_uid: string }): JSX.Element => {
  const { chat } = getChatById(user_uid)[0];
  const { avatar_url, first_name, last_name, was_online_at } = chat;
  const status = getLastSeenLabel(was_online_at);
  const pathname = usePathname();
  const router = useRouter();
  const [showInfo, setShowInfo] = useState<boolean>(true);

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
        <ImageUI src={avatar_url} alt={first_name} width={40} height={40} className={styles.image} />
        <div className={styles.info}>
          <span className={styles.name}>{first_name + ' ' + last_name}</span>
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
