import clsx from 'clsx';
import { useNotificationStore } from 'modules/notification/model/notification.store';
import { JSX } from 'react';
import CopiedIcon from '../../../notification/ui/notification-modal/icons/copied.svg';
import CopyIcon from './icons/copy.svg';
import styles from './info-summary.module.scss';
import { InfoSummaryProps } from './info-summary.props';

export const InfoSummary = ({ nickname, phoneNumber, birthDay, about }: InfoSummaryProps): JSX.Element => {
  const { openNotificationModal, setNotificationIcon, setNotificationTitle } = useNotificationStore();

  const handleCopyNickname = (): void => {
    navigator.clipboard.writeText(nickname);
    setNotificationIcon(<CopiedIcon />);
    setNotificationTitle('Никнейм скопирован');
    openNotificationModal();
  };

  const handleCopyPhone = (): void => {
    if (phoneNumber) {
      navigator.clipboard.writeText(phoneNumber);
      setNotificationIcon(<CopiedIcon />);
      setNotificationTitle('Телефон скопирован');
      openNotificationModal();
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.item}>
        <div className={styles.content}>
          <div className={styles.label}>Никнейм</div>
          <div className={styles.link}>{nickname}</div>
        </div>
        <button onClick={handleCopyNickname}>
          <CopyIcon />
        </button>
      </div>
      {phoneNumber && (
        <div className={clsx(styles.item, styles.itemBorder)}>
          <div className={styles.content}>
            <div className={styles.label}>Номер телефона</div>
            <div className={styles.link}>{phoneNumber}</div>
          </div>
          <button onClick={handleCopyPhone}>
            <CopyIcon />
          </button>
        </div>
      )}
      {birthDay && (
        <div className={clsx(styles.item, styles.itemBorder)}>
          <div className={styles.content}>
            <div className={styles.label}>День рождения</div>
            <div className={styles.text}>{birthDay}</div>
          </div>
        </div>
      )}
      {about && (
        <div className={clsx(styles.item, styles.itemBorder)}>
          <div className={styles.content}>
            <div className={styles.label}>О себе</div>
            <div className={styles.text}>{about}</div>
          </div>
        </div>
      )}
    </div>
  );
};
