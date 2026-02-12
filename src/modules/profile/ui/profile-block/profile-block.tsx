'use client';

import { MAX_PROFILE } from 'modules/profile/shared/utils/profile';
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

export const ProfileBlock = (chat: ProfileBlockProps): JSX.Element => {
  return (
    <ProfileLayout header={<ProfileHeader uid={chat.uid} isBlocked={chat.is_blocked} />}>
      <ProfileAvatar
        avatarHref={chat.avatar_webp_url || '/images/profile/default.png'}
        firstName={chat.first_name}
        lastName={chat.last_name}
        isOnline={chat.is_online}
      />
      <ProfileNotification uid={chat.uid} />
      <ProfileInfo
        nickname={chat.nickname}
        phoneNumber={MAX_PROFILE.phoneNumber}
        birthDay={MAX_PROFILE.birthDay}
        about={MAX_PROFILE.about}
      />
      {!MAX_PROFILE.is_in_contact && <AddButton icon={<AddIcon />} label={'Добавить в контакты'} />}
      {chat.is_blocked && <AddButton icon={<AddIcon />} label={'Разблокировать'} />}
      {MAX_PROFILE.has_uploads && <ProfileUploads uid={chat.uid} />}
    </ProfileLayout>
  );
};
