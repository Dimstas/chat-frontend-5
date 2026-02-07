import Image from 'next/image';
import { JSX } from 'react';
import styles from './user-card.module.scss';

type UserCardProps = {
  avatar: string;
  name: string;
  phone: string;
  nickName: string;
};

export const UserCard: React.FC<UserCardProps> = ({ avatar, name, phone, nickName }: UserCardProps): JSX.Element => {
  return (
    <div className={styles.container}>
      <Image
        src={avatar ? avatar : '/images/settings/noAvatarIcon.svg'}
        alt="avatar"
        width={82}
        height={82}
        className={styles.avatar}
      />
      <div className={styles.content}>
        <p className={styles.name}>{name}</p>
        <p className={styles.secondaryText}>{phone}</p>
        <p className={styles.secondaryText}>{nickName}</p>
      </div>
    </div>
  );
};
