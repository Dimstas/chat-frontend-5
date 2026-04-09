'use client';
import { useChatsScreen } from 'modules/conversation/chats/screens/use-chats-screen';
import { useInfoStore } from 'modules/info/model/info.store';
import { useNotificationStore } from 'modules/notification/model/notification.store';
import { JSX, useState } from 'react';
import { getLastSeenLabel } from 'shared/libs';
import { ImageUI } from 'shared/ui/image';
import { NotificationModal } from '../../../../notification/ui/notification-modal';
import { HeaderTopButtonsBlock } from '../header-top-buttons-block/header-top-buttons-block';
import { SearchMessages } from '../search-messages/search/search-messages';
import styles from './header-top.module.scss';
import type { HeaderTopProps } from './header-top.props';
import CallIcon from './icons/call-icon.svg';
import SearchIcon from './icons/search-icon.svg';

const URL_DEFAULT_Avatar = '/images/messages-chats/default-avatar.svg';

export const HeaderTop = ({ user_uid }: HeaderTopProps): JSX.Element => {
  const { chats } = useChatsScreen();
  const { toggleInfoOpen } = useInfoStore();
  const { isModalOpen } = useNotificationStore();
  const chat = chats.find((c) => c.peer.uid === user_uid);
  const { avatarUrl = '', firstName = '', lastName = '', wasOnlineAt = null } = chat?.peer ?? {};
  const status = getLastSeenLabel(wasOnlineAt);
  const [searchMessagesVisible, setSearchMessagesVisible] = useState<boolean>(false);

  return (
    <div className={styles.wrapper}>
      <div className={styles.contactWrapper}>
        <ImageUI
          src={avatarUrl ? avatarUrl : URL_DEFAULT_Avatar}
          alt={firstName}
          width={40}
          height={40}
          className={styles.image}
          onClick={() => toggleInfoOpen()}
        />
        {searchMessagesVisible ? (
          <SearchMessages setSearchMessagesVisible={setSearchMessagesVisible} />
        ) : (
          <>
            <div className={styles.info} onClick={() => toggleInfoOpen()}>
              <span className={styles.name}>{firstName + ' ' + lastName}</span>
              <span className={styles.status}>{status}</span>
            </div>
            <div className={styles.icon} onClick={() => setSearchMessagesVisible(true)}>
              <SearchIcon />
            </div>
            <div className={styles.icon}>
              <CallIcon />
            </div>
          </>
        )}
      </div>
      <HeaderTopButtonsBlock />
      {isModalOpen && <NotificationModal />}
    </div>
  );
};
