import { JSX, ReactNode } from 'react';
import styles from './profile-layout.module.scss';

export const ProfileLayout = ({ header, children }: { header: ReactNode; children: ReactNode }): JSX.Element => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>{header}</div>
      <div className={styles.body}>{children}</div>
    </div>
  );
};
