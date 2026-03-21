import { useNotificationStore } from 'modules/notification/model/notification.store';
import { JSX, useEffect, useRef } from 'react';
import styles from './notification-modal.module.scss';

export const NotificationModal = (): JSX.Element | null => {
  const { isModalOpen, timer, icon, title, setIcon, setTitle, closePopup, callback, setCallback, setTimer } =
    useNotificationStore();

  const timerIdRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (timerIdRef.current) {
      clearTimeout(timerIdRef.current);
    }

    if (isModalOpen) {
      timerIdRef.current = setTimeout(() => {
        callback?.();

        closePopup();
        setIcon(undefined);
        setTitle('');
        setCallback(undefined);
        setTimer(1000);
      }, timer);
    }

    return (): void => {
      if (timerIdRef.current) {
        clearTimeout(timerIdRef.current);
      }
    };
  });

  const cancelTimer = (): void => {
    if (timerIdRef.current) {
      clearTimeout(timerIdRef.current);
      timerIdRef.current = null;
    }

    closePopup();
    setIcon(undefined);
    setTitle('');
    setCallback(undefined);
    setTimer(1000);
  };

  if (!isModalOpen) return null;

  return (
    <div className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className={styles.info}>
        {icon && <div className={styles.icon}>{icon}</div>}
        <div className={styles.title}>{title}</div>
      </div>
      {callback && (
        <button className={styles.cancelButton} onClick={cancelTimer}>
          Отменить
        </button>
      )}
    </div>
  );
};
