import { JSX, ReactNode } from 'react';
import styles from './conversation-layout.module.scss';

export const ConversationLayout = ({
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
