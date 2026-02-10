import clsx from 'clsx';
import { JSX } from 'react';
import CopyIcon from './icons/copy.svg';
import styles from './info-summary.module.scss';
import { InfoSummaryProps } from './info-summary.props';

export const InfoSummary = ({ nickname, phoneNumber, birthDay, about }: InfoSummaryProps): JSX.Element => {
  return (
    <div className={styles.container}>
      <div className={styles.item}>
        <div className={styles.content}>
          <div className={styles.label}>Никнейм</div>
          <div className={styles.link}>{nickname}</div>
        </div>
        <button>
          <CopyIcon />
        </button>
      </div>
      {phoneNumber && (
        <div className={clsx(styles.item, styles.itemBorder)}>
          <div className={styles.content}>
            <div className={styles.label}>Номер телефона</div>
            <div className={styles.link}>{phoneNumber}</div>
          </div>
          <button>
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
