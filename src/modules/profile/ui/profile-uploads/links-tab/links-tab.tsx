import { JSX } from 'react';
import { CircularProgressLabel } from '../circular-progress-label';
import styles from './links-tab.module.scss';
import { LinksTabProps } from './links-tab.props';

export const LinksTab = ({ items }: LinksTabProps): JSX.Element => {
  return (
    <div className={styles.container}>
      <ul className={styles.linkList}>
        {items.map((item) => (
          <li key={item.messageId} className={styles.listItem}>
            <a href={item.url} target="blank">
              <div className={styles.link}>
                <CircularProgressLabel borderRadius={4}>
                  <div className={styles.label}>{item.title[0]}</div>
                </CircularProgressLabel>
                <div className={styles.linkInfo}>
                  <div className={styles.linkTitle}>{item.title}</div>
                  <div className={styles.linkUrl}>{item.url}</div>
                  <div className={styles.linkDescription}>
                    <div className={styles.user}>{item.fromUser}</div>
                    <div className={styles.dot}>•</div>
                    <div className={styles.date}>{item.created}</div>
                  </div>
                </div>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};
