import { JSX } from 'react';
import SearchIcon from './icons/search.svg';
import styles from './search-input.module.scss';

export const SearchInput = (): JSX.Element => {
  return (
    <div className={styles.inputWrapper}>
      <span className={styles.icon}>
        <SearchIcon />
      </span>
      <input className={styles.input} type="text" name={'search'} placeholder={'Поиск'} />
    </div>
  );
};
