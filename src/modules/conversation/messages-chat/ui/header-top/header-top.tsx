import { getLastSeenLabel } from 'modules/conversation/contacts/lib';
import { JSX } from 'react';
import { ImageUI } from 'shared/ui/image';
import { getContactById } from '../../utils/get-contact-by-id';
import { HeaderTopButtonsBlock } from '../header-top-buttons-block/header-top-buttons-block';
import styles from './header-top.module.scss';
import CallIcon from './icons/call-icon.svg';
import SearchIcon from './icons/search-icon.svg';

export const HeaderTop = ({ user_uid }: { user_uid: string }): JSX.Element => {
  const { avatar, first_name, last_name, status } = getContactById(user_uid)[0];
  const was_online_at = getLastSeenLabel(status);

  return (
    <div className={styles.wrapper}>
      <div className={styles.contactWrapper}>
        <ImageUI src={avatar} alt={first_name} width={40} height={40} className={styles.image} />
        <div className={styles.info}>
          <span className={styles.name}>{first_name + ' ' + last_name}</span>
          <span className={styles.status}>{was_online_at}</span>
        </div>
        <div className={styles.icon}>
          <button>
            <SearchIcon />
          </button>
        </div>
        <div className={styles.icon}>
          <button>
            <CallIcon />
          </button>
        </div>
      </div>
      <HeaderTopButtonsBlock />
    </div>
  );
};
