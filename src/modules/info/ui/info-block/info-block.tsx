'use client';

import { useContactsScreen } from 'modules/conversation/contacts/screens/use-contacts-screen';
import {
  useAddContactQuery,
  useInfoProfileQuery,
  useSearchUserByNicknameQuery,
  useUnblockUserMutation,
} from 'modules/info/api/info.query';
import { useInfoStore } from 'modules/info/model/info.store';
import { formatTimestamp } from 'modules/info/shared/utils/date-time';
import { JSX } from 'react';
import { ActionButton } from '../action-button';
import { InfoAvatar } from '../info-avatar';
import { InfoHeader } from '../info-header';
import { InfoLayout } from '../info-layout';
import { InfoNotification } from '../info-notification';
import { InfoSummary } from '../info-summary';
import AddIcon from './icons/add.svg';
import { InfoBlockProps } from './info-block.props';

export const InfoBlock = ({ uid }: InfoBlockProps): JSX.Element | null => {
  const { isInfoOpen } = useInfoStore();
  const { contacts } = useContactsScreen();
  const { data: profile, isLoading } = useInfoProfileQuery(uid);
  const { mutate: unblockUser } = useUnblockUserMutation(uid);
  const { mutate: addToContact } = useAddContactQuery();

  const contact = contacts?.find((c) => c.uid === uid);

  const { nickname, firstName, lastName, avatarUrl, isOnline, isBlocked } = profile ?? {};
  const isInContacts = !!contact;
  const chatId = profile?.chatId;

  const { data: users } = useSearchUserByNicknameQuery(nickname ?? '');
  const user = users ? users[0] : undefined;

  const handleAddContact = (): void => {
    if (!!user) {
      addToContact({ phone: user?.phone, first_name: user?.first_name, last_name: user?.last_name });
    }
  };

  if (!isInfoOpen) return null;

  return (
    <>
      {isLoading ? (
        <div>Загрузка...</div>
      ) : (
        <InfoLayout header={<InfoHeader uid={uid} isBlocked={isBlocked ?? false} />}>
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
          {isBlocked && <ActionButton icon={<AddIcon />} label={'Разблокировать'} onClick={unblockUser} />}
          {/* {MAX_PROFILE.has_uploads && <InfoUploads uid={uid} />} */}
        </InfoLayout>
      )}
    </>
  );
};
