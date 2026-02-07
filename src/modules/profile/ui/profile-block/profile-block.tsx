'use client';

import { useInfoProfileQuery } from 'modules/profile/api/info.query';
import { formatTimestamp } from 'modules/profile/shared/utils/date-time';
import { JSX } from 'react';
import { AddButton } from '../action-button';
import { ProfileAvatar } from '../profile-avatar';
import { ProfileHeader } from '../profile-header';
import { ProfileInfo } from '../profile-info';
import { ProfileLayout } from '../profile-layout';
import { ProfileNotification } from '../profile-notification';
import AddIcon from './icons/add.svg';
import { ProfileBlockProps } from './profile-block.props';

export const ProfileBlock = ({ uid }: ProfileBlockProps): JSX.Element => {
  void uid;
  const { data, isLoading, isError, error } = useInfoProfileQuery(uid);

  if (isLoading) return <div>Загрузка...</div>;
  if (isError) return <div>Ошибка: {error.message}</div>;

  return (
    <ProfileLayout header={<ProfileHeader uid={uid} isBlocked={data?.isBlocked ?? false} />}>
      <ProfileAvatar
        avatarHref={data?.avatarUrl ?? '/images/profile/default.png'}
        firstName={data?.firstName ?? ''}
        lastName={data?.lastName ?? ''}
        isOnline={data?.isOnline ?? false}
      />
      <ProfileNotification uid={uid} />
      <ProfileInfo
        nickname={data?.nickName ?? ''}
        phoneNumber={data?.userName}
        birthDay={formatTimestamp(data?.birthday)}
        about={data?.additionalInformation}
      />
      {/* {!MAX_PROFILE.is_in_contact && <AddButton icon={<AddIcon />} label={'Добавить в контакты'} />} */}
      {data?.isBlocked && <AddButton icon={<AddIcon />} label={'Разблокировать'} />}
      {/* {MAX_PROFILE.has_uploads && <ProfileUploads uid={uid} />} */}
    </ProfileLayout>
  );
};
