'use client';

import { useChatsStore } from 'modules/conversation/chats/model/search';
import { AddContactModal } from 'modules/conversation/chats/ui/add-contact-modal';
import { useContactsScreen } from 'modules/conversation/contacts/screens/use-contacts-screen';
import { useAddContactQuery, useInfoProfileQuery, useSearchUserByNicknameQuery } from 'modules/info/api/info.query';
import { useInfoStore } from 'modules/info/model/info.store';
import { formatTimestamp } from 'modules/info/shared/utils/date-time';
import { JSX, useEffect } from 'react';
import { ActionButton } from '../action-button';
import { BlockContactModal } from '../block-contact-modal';
import { ClearChatModal } from '../clear-chat-modal';
import { FrowardProfileModal } from '../forward-profile-modal';
import { InfoAvatar } from '../info-avatar';
import { InfoHeader } from '../info-header';
import { InfoLayout } from '../info-layout';
import { InfoNotification } from '../info-notification';
import { InfoSummary } from '../info-summary';
import { UnblockContactModal } from '../unblock-contact-modal';
import AddIcon from './icons/add.svg';
import { InfoBlockProps } from './info-contact-block.props';

export const InfoContactBlock = ({ uid, wsUrl, currentUid }: InfoBlockProps): JSX.Element => {
  const { openUnblockModal, setUid } = useInfoStore();
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
          <InfoLayout header={<InfoHeader isBlocked={isBlocked ?? false} />}>
            <InfoAvatar
              avatarHref={avatarUrl ?? '/images/profile/default.png'}
              firstName={firstName ?? ''}
              lastName={lastName ?? ''}
              isOnline={isOnline ?? false}
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
