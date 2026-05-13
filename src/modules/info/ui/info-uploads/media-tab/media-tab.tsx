import { JSX } from 'react';
import { ImageUI } from 'shared/ui';
import styles from './media-tab.module.scss';
import { MediaTabProps } from './media-tab.props';

export const MediaTab = ({ items }: MediaTabProps): JSX.Element => {
  return (
    <div className={styles.container}>
      {items.map((item, index) => (
        <ImageUI
          key={index}
          src={item.file_url}
          alt={item.download_name}
          width={117}
          height={117}
          className={styles.image}
        />
      ))}
    </div>
  );
};
