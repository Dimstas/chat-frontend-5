'use client';
import { useChatsScreen } from 'modules/conversation/chats/screens/use-chats-screen';
import { useContactsScreen } from 'modules/conversation/contacts/screens/use-contacts-screen';
import { useCallsStore } from 'modules/conversation/messages-chat/model/calls/calls.store';
import { useInfoStore } from 'modules/info/model/info.store';
import { useNotificationStore } from 'modules/notification/model/notification.store';
import { JSX, useEffect, useState } from 'react';
import { getLastSeenLabel } from 'shared/libs';
import { ImageUI } from 'shared/ui/image';
import { NotificationModal } from '../../../../notification/ui/notification-modal';
import { IncomingCallPanel } from '../../widgets/incoming-call-panel';
import { OutgoingCallPanel } from '../../widgets/outgoing-call-panel';
import {
  useHeaderButtonsModalStore,
  useSearchIndicatorStore,
  useSearchMessagesStore,
} from '../../zustand-store/zustand-store';
import { AddModal } from '../header-top-buttons-block/add-modal';
import { BlockModal } from '../header-top-buttons-block/block-modal';
import { HeaderTopButtonsBlock } from '../header-top-buttons-block/header-top-buttons-block';
import { LeaveGroupModal } from '../header-top-buttons-block/leave-group-modal';
import { SearchResultCard } from '../search-messages/search-result-card/search-result-card';
import { SearchMessages } from '../search-messages/search/search-messages';
import styles from './header-top.module.scss';
import CallIcon from './icons/call-icon.svg';
import SearchIcon from './icons/search-icon.svg';

const URL_DEFAULT_Avatar = '/images/messages-chats/default-avatar.svg';

export const HeaderTop = ({
  wsUrl,
  user_uid,
  currentUid,
}: {
  wsUrl: string;
  user_uid: string;
  currentUid: string;
}): JSX.Element => {
  const { chats } = useChatsScreen();
  const { isCallModalOpen, isIncomingModalOpen, toggleCallsOpen } = useCallsStore();
  const { toggleInfoOpen } = useInfoStore();
  const { isModalOpen } = useNotificationStore();
  const { isBlockModalOpen, isAddModalOpen, isLeaveGroupModalOpen, closeButtonMenu, openButtonMenu } =
    useHeaderButtonsModalStore();

  const isGroupOrChannel = user_uid.startsWith('group') || user_uid.startsWith('channel');
  const chat = isGroupOrChannel
    ? chats.find((c) => c.chat.chatKey === user_uid)
    : chats.find((c) => c.peer.uid === user_uid);

  const {
    avatarUrl = '',
    firstName = '',
    lastName = '',
    nickname = '',
    wasOnlineAt = null,
    isBlocked = false,
    isInContacts = false,
  } = chat?.peer ?? {};
  const status = getLastSeenLabel(wasOnlineAt);
  const [searchMessagesVisible, setSearchMessagesVisible] = useState<boolean>(false);
  const searchIndicatorStore = useSearchIndicatorStore((s) => s.searchIndicator);
  const searchMessagesStore = useSearchMessagesStore((s) => s.searchMessages);
  useEffect(() => {
    if (isBlocked && isInContacts) {
      closeButtonMenu();
    } else {
      openButtonMenu();
    }
  }, [closeButtonMenu, openButtonMenu, isBlocked, isInContacts, user_uid]);
  const { contacts } = useContactsScreen();

  return (
    <>
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
                <span className={styles.name}>{isGroupOrChannel ? chat?.chat.name : `${firstName} ${lastName}`}</span>
                <span className={styles.status}>{status}</span>
              </div>
              <div className={styles.icon} onClick={() => setSearchMessagesVisible(true)}>
                <SearchIcon />
              </div>
              <div className={styles.icon} onClick={() => toggleCallsOpen()}>
                <CallIcon />
              </div>
            </>
          )}
        </div>
        {searchMessagesStore && (
          <SearchResultCard
            currentSearchIndex={searchIndicatorStore?.currentSearchIndex ?? 0}
            lastSearchIndex={searchIndicatorStore?.lastSearchIndex ?? 0}
          />
        )}
        {!contacts?.some((c) => c.uid === user_uid) && (
          <HeaderTopButtonsBlock
            wsUrl={wsUrl}
            nickname={nickname ?? ''}
            currentUid={currentUid}
            chatKey={user_uid}
            isBlocked={isBlocked}
            isInContact={isInContacts}
          />
        )}
        {isModalOpen && <NotificationModal />}
        {isBlockModalOpen && <BlockModal />}
        {isAddModalOpen && <AddModal fullName={`${firstName} ${lastName}`} />}
        {isLeaveGroupModalOpen && (
          <LeaveGroupModal wsUrl={wsUrl} chatKey={user_uid} currentUid={currentUid} name={nickname} />
        )}
      </div>
      {isCallModalOpen && <OutgoingCallPanel avatarUrl={avatarUrl} contact={`${firstName} ${lastName}`} />}
      {isIncomingModalOpen && <IncomingCallPanel contactFio={'test'} onReject={() => {}} onAccept={() => {}} />}
    </>
  );
};
