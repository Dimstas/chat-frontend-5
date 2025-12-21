import { JSX } from 'react';
import { ImageUI } from 'shared/ui/image';
import { getLastSeenLabel } from '../../../libs';
import styles from './contact-card.module.scss';
import { ContactCardProps } from './contact-card.props';

export const ContactCard = ({ avatarHref, username, lastname, was_online_at }: ContactCardProps): JSX.Element => {
  const status = getLastSeenLabel(was_online_at);

  return (
    <li>
      <button className={styles.card}>
        <ImageUI src={avatarHref} alt={username} width={40} height={40} />
        <div className={styles.info}>
          <span className={styles.name}>{username + lastname}</span>
          <span className={styles.status}>{status}</span>
        </div>
      </button>
    </li>
  );
};
