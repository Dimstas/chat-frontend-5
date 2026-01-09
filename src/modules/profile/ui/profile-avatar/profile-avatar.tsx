import { JSX } from 'react';
import { ImageUI } from 'shared/ui/index';
import styles from './profile-avatar.module.scss';
import { ProfileAvatarProps } from './profile-avatar.props';

export const ProfileAvatar = ({ avatarHref, firstName, lastName, isOnline }: ProfileAvatarProps): JSX.Element => {
  return (
    <div className={styles.container}>
      <ImageUI src={avatarHref} alt={lastName} width={360} height={360} />
      <div className={styles.imageLabel}>
        <div className={styles.name}>{`${firstName} ${lastName}`}</div>
        <div className={styles.status}>{isOnline ? 'в сети' : 'не в сети'}</div>
      </div>
    </div>
  );
};
