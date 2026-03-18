import clsx from 'clsx';
import { JSX } from 'react';
import styles from './alert-layout.module.scss';
import type { AlertLayoutProps } from './alert-layout.props';

export const AlertLayout = ({
  id,
  title,
  message,
  okText = 'Удалить',
  cancelText = 'Отмена',
  showCheckBox = false,
  onOk,
  onCancel,
}: AlertLayoutProps): JSX.Element => {
  return (
    <div
      id={`${id}`}
      role="dialog"
      className={styles.wrapperIncoming}
      aria-modal="true"
      aria-labelledby={`alert_title_${id}`}
    >
      <div className={styles.contentIncoming}>
        <div className={styles.titleIncoming}>{title}</div>
        <div className={styles.textIncoming}>{message}</div>
      </div>
      {showCheckBox && <CheckBox />}
      <div className={styles.buttonsBlock}>
        <button className={styles.buttonCancel} onClick={onCancel}>
          <div className={clsx(styles.textButton, styles.textButton)}>{cancelText}</div>
        </button>
        <button className={styles.buttonDelete} onClick={onOk}>
          <div className={clsx(styles.textButton, styles.textButton)}>{okText}</div>
        </button>
      </div>
    </div>
  );
};

const CheckBox = (): JSX.Element => {
  return <></>;
};
