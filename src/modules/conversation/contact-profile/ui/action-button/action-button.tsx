import { JSX, ReactNode } from 'react';
import styles from './action-button.module.scss';

export const ActionButton = ({ icon, label }: { icon: ReactNode; label: ReactNode }): JSX.Element => {
  return (
    <div className={styles.container}>
      <button className={styles.button}>
        {icon}
        <span className={styles.label}>{label}</span>
      </button>
    </div>
  );
};
