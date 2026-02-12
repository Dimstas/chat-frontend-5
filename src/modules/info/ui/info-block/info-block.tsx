'use client';

import { useChatStore } from 'modules/conversation/chats/model/chat.store';
import { useInfoProfileQuery } from 'modules/info/api';
import { useUnblockUserMutation } from 'modules/info/api/info.query';
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
  const { data, isLoading } = useInfoProfileQuery(uid);
  const { findById, selected } = useChatStore();
  const { mutate: unblockUser } = useUnblockUserMutation(uid);

  if (!selected) return null;

  const chat = findById(uid);

  return (
    <>
      {isLoading ? (
        <div>Загрузка...</div>
      ) : (
        <InfoLayout header={<InfoHeader uid={uid} isBlocked={data?.isBlocked ?? false} />}>
          <InfoAvatar
            avatarHref={chat?.peer?.avatarUrl ?? '/images/profile/default.png'}
            firstName={chat?.peer?.firstName ?? ''}
            lastName={chat?.peer?.lastName ?? ''}
            isOnline={chat?.peer?.isOnline ?? false}
          />
          <InfoNotification chatId={chat?.chat.id} />
          <InfoSummary
            nickname={chat?.peer?.nickname ?? ''}
            phoneNumber={chat?.peer?.username}
            birthDay={formatTimestamp(data?.birthday)}
            about={data?.additionalInformation}
          />
          {!chat?.peer?.isInContacts && <ActionButton icon={<AddIcon />} label={'Добавить в контакты'} />}
          {data?.isBlocked && <ActionButton icon={<AddIcon />} label={'Разблокировать'} onClick={unblockUser} />}
          {/* {MAX_PROFILE.has_uploads && <InfoUploads uid={uid} />} */}
        </InfoLayout>
      )}
    </>
  );
};
