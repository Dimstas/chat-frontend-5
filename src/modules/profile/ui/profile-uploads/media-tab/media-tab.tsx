import { JSX } from 'react';
import { ImageUI } from 'shared/ui';
import styles from './media-tab.module.scss';
import { MediaTabProps } from './media-tab.props';

export const MediaTab = ({ items }: MediaTabProps): JSX.Element => {
  return (
    <div className={styles.container}>
      {items.map((item) => (
        <ImageUI key={item.id} src={item.url} alt={item.file} width={117} height={117} className={styles.image} />
      ))}
    </div>
  );
};
