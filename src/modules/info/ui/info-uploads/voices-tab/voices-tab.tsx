import { JSX } from 'react';
import styles from './voices-tab.module.scss';
import { VoicesTabProps } from './voices-tab.props';

export const VoicesTab = ({ items }: VoicesTabProps): JSX.Element => {
  return (
    <div className={styles.container}>
      <ul className={styles.fileList}>
        {items.map((item) => (
          <li key={item.uid} className={styles.listItem}>
            {item.download_name}
            {/* <Voice item={item} onToggle={handleToggle} /> */}
          </li>
        ))}
      </ul>
    </div>
  );
};
