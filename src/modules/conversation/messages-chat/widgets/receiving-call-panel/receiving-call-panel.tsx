import clsx from 'clsx';
import { JSX } from 'react';
import { ImageUI } from 'shared/ui';
import { useCallsStore } from '../../model/calls';
import styles from './receiving-call-panel.module.scss';

type ReceivingCallPanelProps = {
  onReject: () => void;
  onAccept: () => void;
};

export const ReceivingCallPanel = ({ onAccept, onReject }: ReceivingCallPanelProps): JSX.Element | null => {
  const { setCallData, contactFio, avatarUrl } = useCallsStore();

  const handleAccept = (): void => {
    onAccept();
    setCallData({
      isReceivingModalOpen: false,
    });
  };

  const handleReject = (): void => {
    onReject();
    setCallData({
      isReceivingModalOpen: false,
    });
  };

  const URL_DEFAULT_AVATAR = '/images/profile/default.png';

  return (
    <div className={styles.wrapper}>
      <div className={styles.info}>
        <ImageUI
          src={avatarUrl ?? URL_DEFAULT_AVATAR}
          alt={contactFio}
          width={160}
          height={160}
          className={styles.avatar}
        />
        <div className={styles.description}>
          <div className={styles.contact}>{`${contactFio}`}</div>
          <div className={styles.state}>Входящий звонок</div>
        </div>
      </div>
      <div className={styles.footerButtons}>
        <button className={clsx(styles.button, styles.cancelButton)} onClick={handleReject}>
          Отмена
        </button>
        <button className={clsx(styles.button, styles.answerButton)} onClick={handleAccept}>
          Ответить
        </button>
      </div>
    </div>
  );
};
