'use client';
import { JSX } from 'react';
import styles from './alert-forward.module.scss';
import Close from './icons/close.svg';
import Search from './icons/search.svg';

export const AlertForward = (): JSX.Element => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.headerTop}>
        <div className={styles.textHeaderTop}>Переслать</div>
        <div className={styles.icon}>
          <Close />
        </div>
      </div>
      <div className={styles.searchWrapper}>
        <div className={styles.searchContainer}>
          <div className={styles.icon}>
            <Search />
          </div>
          <input className={styles.searchInput} />
        </div>
      </div>
      <div className={styles.cardWrapper}>
        <div className={styles.avatar}>avatar</div>
        <div className={styles.nameEndStatus}>
          <div className={styles.name}>first name and last name</div>
          <div className={styles.status}>status</div>
        </div>
      </div>
    </div>
  );
};
