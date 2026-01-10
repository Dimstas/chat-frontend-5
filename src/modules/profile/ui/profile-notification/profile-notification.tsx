import clsx from 'clsx';
import { JSX, useState } from 'react';
import styles from './profile-notification.module.scss';
import { ProfileNotificationProps } from './profile-notification.props';

export const ProfileNotification = ({ uid }: ProfileNotificationProps): JSX.Element => {
  const [enable, setEnable] = useState(true);

  const handleToggle = (): void => {
    setEnable(!enable);
  };

  return (
    <div className={styles.container}>
      <span className={styles.label}>Уведомления</span>
      <button className={styles.toggleButton} onClick={handleToggle}>
        <div className={clsx(styles.toggle, enable ? styles.enabled : styles.disabled)}>
          <div className={clsx(styles.circle, enable ? styles.enabled : styles.disabled)}></div>
        </div>
      </button>
    </div>
  );
};
