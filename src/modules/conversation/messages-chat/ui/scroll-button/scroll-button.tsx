import { JSX } from 'react';
import CheckIcon from './icons/check.svg';
import styles from './scroll-button.module.scss';

export const ScrollButton = (): JSX.Element => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.circle}>
        <CheckIcon />
      </div>
    </div>
  );
};
