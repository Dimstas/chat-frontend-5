import { JSX, ReactNode } from 'react';
import styles from './list-layout.module.scss';

export const ConversationListLayout = ({
  header,
  children,
  footer,
}: {
  header: ReactNode;
  children: ReactNode;
  footer: ReactNode;
}): JSX.Element => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>{header}</div>
      <div className={styles.body}>{children}</div>
      {footer}
    </div>
  );
};
