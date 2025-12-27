import { JSX } from 'react';
import { ImageUI } from 'shared/ui/image';
import { getLastSeenLabel } from '../../../libs';
import styles from './header-top.module.scss';
import { HeaderTopProps } from './header-top.props';

export const HeaderTop = ({ avatarHref, username, lastname, was_online_at }: HeaderTopProps): JSX.Element => {
  const status = getLastSeenLabel(was_online_at);

  return (
    <>
      <ImageUI src={avatarHref} alt={username} width={43.2} height={43.2} className={styles.image} />
      <div className={styles.info}>
        <span className={styles.name}>{username + lastname}</span>
        <span className={styles.status}>{status}</span>
      </div>
      <div className={styles.icon}>1</div>
      <div className={styles.icon}>2</div>
    </>
  );
};
