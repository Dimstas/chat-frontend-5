import { JSX, ReactNode } from 'react';
import styles from './contacts-section.module.scss';
import DeleteIcon from './icons/delete.svg';

export const ContactsSections = ({ children }: { children: ReactNode }): JSX.Element => {
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <span className={styles.title}>Контакты пользователей А-чата</span>
        <span>
          <DeleteIcon />
        </span>
      </div>
      <ul className={styles.ul}>{children}</ul>
    </div>
  );
};
