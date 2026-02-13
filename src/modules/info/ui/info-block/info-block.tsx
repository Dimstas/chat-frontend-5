'use client';

import { useChatStore } from 'modules/conversation/chats/model/chat.store';
import {
  useAddContactQuery,
  useInfoProfileQuery,
  useSearchUserByNicknameQuery,
  useUnblockUserMutation,
} from 'modules/info/api/info.query';
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
  const { data: profile, isLoading } = useInfoProfileQuery(uid);
  const { findById, selected } = useChatStore();
  const { mutate: unblockUser } = useUnblockUserMutation(uid);
  const { mutate: addToContact } = useAddContactQuery();
  const { data: users } = useSearchUserByNicknameQuery(selected?.peer.nickname ?? '');

  if (!selected) return null;

  const chat = findById(uid);
  const user = users ? users[0] : undefined;

  const handleAddContact = (): void => {
    if (!!user) {
      addToContact({ phone: user?.phone, firstName: user?.first_name, lastName: user?.last_name });
    }
  };

  return (
    <>
      {isLoading ? (
        <div>Загрузка...</div>
      ) : (
        <InfoLayout header={<InfoHeader uid={uid} isBlocked={profile?.isBlocked ?? false} />}>
          <InfoAvatar
            avatarHref={chat?.peer?.avatarUrl ?? '/images/profile/default.png'}
            firstName={chat?.peer?.firstName ?? ''}
            lastName={chat?.peer?.lastName ?? ''}
            isOnline={chat?.peer?.isOnline ?? false}
          />
          <InfoNotification chatId={chat?.chat.id} />
          <InfoSummary
            nickname={chat?.peer?.nickname ?? ''}
            phoneNumber={user?.phone}
            birthDay={formatTimestamp(user?.birthday)}
            about={user?.additional_information}
          />
          {!chat?.peer?.isInContacts && (
            <ActionButton icon={<AddIcon />} label={'Добавить в контакты'} onClick={handleAddContact} />
          )}
          {profile?.isBlocked && <ActionButton icon={<AddIcon />} label={'Разблокировать'} onClick={unblockUser} />}
          {/* {MAX_PROFILE.has_uploads && <InfoUploads uid={uid} />} */}
        </InfoLayout>
      )}
    </>
  );
};
