import clsx from 'clsx';
import { JSX } from 'react';
import { ImageUI } from 'shared/ui';
import styles from './incoming-call-panel.module.scss';

type IncomingCallPanelProps = {
  avatarUrl?: string;
  contactFio: string;
  onReject: () => void;
  onAccept: () => void;
};

export const IncomingCallPanel = ({
  avatarUrl,
  contactFio,
  onAccept,
  onReject,
}: IncomingCallPanelProps): JSX.Element | null => {
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
        <button className={clsx(styles.button, styles.cancelButton)}>Отмена</button>
        <button className={clsx(styles.button, styles.answerButton)}>Ответить</button>
      </div>
    </div>
  );
};
