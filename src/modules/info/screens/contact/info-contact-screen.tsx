'use client';

import { useChatsStore } from 'modules/conversation/chats/model/search';
import { AddContactModal } from 'modules/conversation/chats/ui/add-contact-modal';
import { useContactsScreen } from 'modules/conversation/contacts/screens/use-contacts-screen';
import { useInfoProfileQuery } from 'modules/info/api';
import { useAddContactQuery, useSearchUserByNicknameQuery } from 'modules/info/api/info.query';
import { useInfoStore } from 'modules/info/model/info.store';
import { formatTimestamp } from 'modules/info/shared/utils/date-time';
import { ActionButton } from 'modules/info/ui/action-button';
import { BlockContactModal } from 'modules/info/ui/block-contact-modal';
import { ClearChatModal } from 'modules/info/ui/clear-chat-modal';
import { FrowardProfileModal } from 'modules/info/ui/forward-profile-modal';
import { InfoAvatar } from 'modules/info/ui/info-avatar';
import { InfoHeader } from 'modules/info/ui/info-header';
import { InfoLayout } from 'modules/info/ui/info-layout';
import { InfoNotification } from 'modules/info/ui/info-notification';
import { InfoSummary } from 'modules/info/ui/info-summary';
import { UnblockContactModal } from 'modules/info/ui/unblock-contact-modal';
import { JSX, useEffect } from 'react';
import { DropdownItem } from 'shared/ui/dropdown/dropdown.props';
import AddIcon from '../../shared/icons/add.svg';
import BlockIcon from '../../shared/icons/block.svg';
import ClearIcon from '../../shared/icons/clear.svg';
import ForwardIcon from '../../shared/icons/forward.svg';
import { InfoContactScreenProps } from './info-contact-screen.props';

export const InfoContactScreen = ({ uid, wsUrl, currentUid }: InfoContactScreenProps): JSX.Element => {
  const { openUnblockModal, setUid, openBlockModal, openClearModal, openForwardModal } = useInfoStore();
  const { contacts } = useContactsScreen();
  const { data: profile, isLoading } = useInfoProfileQuery(uid);
  const { mutate: addToContact } = useAddContactQuery();
  const { openAddModal } = useChatsStore();

  const contact = contacts?.find((c) => c.uid === uid);

  const { nickname, firstName, lastName, avatarUrl, isOnline, isBlocked } = profile ?? {};
  const isInContacts = !!contact;
  const chatId = profile?.chatId;

  const { data: users } = useSearchUserByNicknameQuery(nickname ?? '');
  const user = users ? users[0] : undefined;

  const menuItems: DropdownItem[] = [
    {
      label: 'Поделиться профилем',
      icon: <ForwardIcon />,
      onClick: openForwardModal,
    },
    {
      label: 'Очистить чат',
      icon: <ClearIcon />,
      onClick: openClearModal,
    },
  ];

  if (!isBlocked) {
    menuItems.push({
      label: 'Заблокировать',
      icon: <BlockIcon />,
      variant: 'alert',
      onClick: openBlockModal,
    });
  }

  useEffect(() => {
    setUid(uid);
  }, [uid, setUid]);

  const handleAddContact = (): void => {
    if (!!user) {
      addToContact({ phone: user?.phone, first_name: user?.first_name, last_name: user?.last_name });
      openAddModal();
    }
  };

  const handleUnblockContact = (): void => {
    openUnblockModal();
  };

  return (
    <>
      {isLoading ? (
        <div>Загрузка...</div>
      ) : (
        <>
          <InfoLayout header={<InfoHeader menuItems={menuItems} />}>
            <InfoAvatar
              avatarHref={avatarUrl ?? '/images/profile/default.png'}
              label={`${firstName} ${lastName}`}
              status={isOnline ? 'в сети' : 'не в сети'}
            />
            <InfoNotification chatId={chatId} />
            <InfoSummary
              nickname={nickname ?? ''}
              phoneNumber={user?.phone}
              birthDay={formatTimestamp(user?.birthday)}
              about={user?.additional_information}
            />
            {!isInContacts && (
              <ActionButton icon={<AddIcon />} label={'Добавить в контакты'} onClick={handleAddContact} />
            )}
            {isBlocked && <ActionButton icon={<AddIcon />} label={'Разблокировать'} onClick={handleUnblockContact} />}
            {/* {MAX_PROFILE.has_uploads && <InfoUploads uid={uid} />} */}
          </InfoLayout>
          <AddContactModal />
          <BlockContactModal />
          <UnblockContactModal />
          <ClearChatModal />
          <FrowardProfileModal wsUrl={wsUrl} currentUid={currentUid} nickname={nickname ?? ''} />
        </>
      )}
    </>
  );
};
