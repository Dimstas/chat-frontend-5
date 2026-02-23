import Image from 'next/image';
import { JSX, useState } from 'react';
import styles from './user-card.module.scss';

type UserCardProps = {
  avatar: string;
  name: string;
  phone: string;
  nickName: string;
};

export const UserCard: React.FC<UserCardProps> = ({ avatar, name, phone, nickName }) => {
  const [imageError, setImageError] = useState(false);

  const handleError = () => {
    setImageError(true);
  };

  const isValidUrl = typeof avatar === 'string' && 
    avatar.trim() !== '' && 
    (avatar.startsWith('/') || avatar.startsWith('http://') || avatar.startsWith('https://'));

  const src = imageError || !isValidUrl 
    ? '/images/settings/noAvatarIcon.svg' 
    : avatar;

  return (
    <div className={styles.container}>
      <Image
        src={src}
        alt="avatar"
        width={82}
        height={82}
        className={styles.avatar}
        onError={handleError}
        unoptimized={true}
      />
      <div className={styles.content}>
        <p className={styles.name}>{name}</p>
        <p className={styles.secondaryText}>{phone}</p>
        <p className={styles.secondaryText}>{nickName}</p>
      </div>
    </div>
  );
};