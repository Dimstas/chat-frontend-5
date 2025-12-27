import clsx from 'clsx';
import { JSX } from 'react';
import styles from './default-page.module.scss';

export const DefaultPage = (): JSX.Element => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.textWrapper}>
        <span className={clsx(styles.text)}>Выберите контакт для начала общения</span>
      </div>
    </div>
  );
};
