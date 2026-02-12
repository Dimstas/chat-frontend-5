import { JSX } from 'react';
import { ImageUI } from 'shared/ui/index';
import styles from './info-avatar.module.scss';
import { InfoAvatarProps } from './info-avatar.props';

export const InfoAvatar = ({ avatarHref, firstName, lastName, isOnline }: InfoAvatarProps): JSX.Element => {
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
