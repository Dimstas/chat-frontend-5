import { useChatsStore } from 'modules/conversation/chats/model/search';
import { JSX, useEffect } from 'react';
import styles from './notification-modal.module.scss';

export const NotificationModal = (): JSX.Element | null => {
  const {
    isNotificationModalOpen,
    notificationIcon,
    notificationTitle,
    setNotificationIcon,
    setNotificationTitle,
    closeNotificationModal,
  } = useChatsStore();

  useEffect(() => {
    const timerId = setTimeout(() => {
      closeNotificationModal();
      setNotificationIcon(undefined);
      setNotificationTitle('');
    }, 3000);

    return (): void => clearTimeout(timerId);
  });

  if (!isNotificationModalOpen) return null;

  return (
    <div className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className={styles.icon}>{notificationIcon}</div>
      <div className={styles.title}>{notificationTitle}</div>
    </div>
  );
};
