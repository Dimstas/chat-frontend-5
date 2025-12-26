'use client';

import { MAX_PROFILE } from 'modules/conversation/shared/utils/profile';
import { JSX } from 'react';
import { AddButton } from '../action-button';
import { ProfileAvatar } from '../profile-avatar';
import { ProfileHeader } from '../profile-header';
import { ProfileInfo } from '../profile-info';
import { ProfileLayout } from '../profile-layout';
import { ProfileNotification } from '../profile-notification';
import { ProfileUploads } from '../profile-uploads';
import AddIcon from './icons/add.svg';
import { ProfileBlockProps } from './profile-block.props';

export const ProfileBlock = ({ uid }: ProfileBlockProps): JSX.Element => {
  void uid;

  return (
    <ProfileLayout header={<ProfileHeader uid={uid} />}>
      <ProfileAvatar
        avatarHref={MAX_PROFILE.avatar_url ?? '/images/profile/default.png'}
        firstName={MAX_PROFILE.first_name}
        lastName={MAX_PROFILE.last_name}
        isOnline={MAX_PROFILE.is_online}
      />
      <ProfileNotification uid={uid} />
      <ProfileInfo
        nickname={MAX_PROFILE.nickname}
        phoneNumber={MAX_PROFILE.phoneNumber}
        birthDay={MAX_PROFILE.birthDay}
        about={MAX_PROFILE.about}
      />
      {!MAX_PROFILE.is_in_contact && <AddButton icon={<AddIcon />} label={'Добавить в контакты'} />}
      {MAX_PROFILE.is_blocked && <AddButton icon={<AddIcon />} label={'Разблокировать'} />}
      {MAX_PROFILE.has_uploads && <ProfileUploads />}
    </ProfileLayout>
  );
};
