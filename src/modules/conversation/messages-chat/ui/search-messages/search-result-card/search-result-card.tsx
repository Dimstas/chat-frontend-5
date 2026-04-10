import { JSX } from 'react';
import styles from './search-result-card.module.scss';
import type { SearchResultCardProps } from './search-result-card.props';

export const SearchResultCard = ({ currentSearchIndex, lastSearchIndex }: SearchResultCardProps): JSX.Element => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.text}>{`Результаты: ${currentSearchIndex} из ${lastSearchIndex}`}</div>
    </div>
  );
};
