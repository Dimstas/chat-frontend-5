import { JSX, ReactNode } from 'react';
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
  return (
    <div className={styles.wrapper}>
      {headerTop}
      {children}
      {headerBottom}
    </div>
  );
};
