'use client';

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

export const InfoBlock = ({ uid }: InfoBlockProps): JSX.Element => {
  void uid;
  const { data, isLoading, isError, error } = useInfoProfileQuery(uid);
  const { mutate: unblockUser } = useUnblockUserMutation(uid);

  if (isLoading) return <div>Загрузка...</div>;
  if (isError) return <div>Ошибка: {error.message}</div>;

  return (
    <InfoLayout header={<InfoHeader uid={uid} isBlocked={data?.isBlocked ?? false} />}>
      <InfoAvatar
        avatarHref={data?.avatarUrl ?? '/images/profile/default.png'}
        firstName={data?.firstName ?? ''}
        lastName={data?.lastName ?? ''}
        isOnline={data?.isOnline ?? false}
      />
      <InfoNotification uid={uid} />
      <InfoSummary
        nickname={data?.nickName ?? ''}
        phoneNumber={data?.userName}
        birthDay={formatTimestamp(data?.birthday)}
        about={data?.additionalInformation}
      />
      {/* {!MAX_PROFILE.is_in_contact && <ActionButton icon={<AddIcon />} label={'Добавить в контакты'} />} */}
      {data?.isBlocked && <ActionButton icon={<AddIcon />} label={'Разблокировать'} onClick={unblockUser} />}
      {/* {MAX_PROFILE.has_uploads && <InfoUploads uid={uid} />} */}
    </InfoLayout>
  );
};
