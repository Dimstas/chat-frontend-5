import { JSX, ReactNode } from 'react';
import { DefaultPage } from '../default-page/default-page';
import styles from './messages-list-layout.module.scss';

export const MessagesListLayout = ({
  headerTop,
  children,
  headerBottom,
}: {
  headerTop: ReactNode;
  children: ReactNode;
  headerBottom: ReactNode;
}): JSX.Element => {
  if (headerTop === null) {
    return <DefaultPage />;
  } else {
    return (
      <div className={styles.wrapper}>
        <div className={styles.headerTop}>{headerTop}</div>
        <div className={styles.body}>{children}</div>
        <div className={styles.headerBottom}>{headerBottom}</div>
      </div>
    );
  }
};
