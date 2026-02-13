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
  const { selected, isInfoOpen, setSelected } = useChatStore();
  const { data: profile, isLoading } = useInfoProfileQuery(uid);
  const { mutate: unblockUser } = useUnblockUserMutation(uid);
  const { mutate: addToContact } = useAddContactQuery();
  const { data: users } = useSearchUserByNicknameQuery(selected?.peer.nickname ?? '');

  if (!isInfoOpen) return null;

  if (!selected) {
    setSelected(uid);
  }

  const user = users ? users[0] : undefined;

  const handleAddContact = (): void => {
    if (!!user) {
      addToContact({ phone: user?.phone, first_name: user?.first_name, last_name: user?.last_name });
    }
  };

  return (
    <>
      {isLoading ? (
        <div>Загрузка...</div>
      ) : (
        <InfoLayout header={<InfoHeader uid={uid} isBlocked={profile?.isBlocked ?? false} />}>
          <InfoAvatar
            avatarHref={selected?.peer?.avatarUrl ?? '/images/profile/default.png'}
            firstName={selected?.peer?.firstName ?? ''}
            lastName={selected?.peer?.lastName ?? ''}
            isOnline={selected?.peer?.isOnline ?? false}
          />
          <InfoNotification chatId={selected?.chat.id} />
          <InfoSummary
            nickname={selected?.peer?.nickname ?? ''}
            phoneNumber={user?.phone}
            birthDay={formatTimestamp(user?.birthday)}
            about={user?.additional_information}
          />
          {!selected?.peer?.isInContacts && (
            <ActionButton icon={<AddIcon />} label={'Добавить в контакты'} onClick={handleAddContact} />
          )}
          {profile?.isBlocked && <ActionButton icon={<AddIcon />} label={'Разблокировать'} onClick={unblockUser} />}
          {/* {MAX_PROFILE.has_uploads && <InfoUploads uid={uid} />} */}
        </InfoLayout>
      )}
    </>
  );
};
