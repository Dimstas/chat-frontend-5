import { JSX } from 'react';
import { Header } from './header';
import styles from './protected-layout.module.scss';
import { ProtectedLayoutProps } from './protected-layout.props';

export const ProtectedLayout = ({ nav, list, main, info }: ProtectedLayoutProps): JSX.Element => {
  return (
    <div className={styles.root}>
      <Header />

      <div className={styles.shell}>
        <div className={styles.mainGrid}>
          <aside className={styles.nav}>{nav}</aside>
          <aside className={styles.list}>{list}</aside>
          <main className={styles.main}>{main}</main>
          <div>{info}</div>
        </div>
      </div>
    </div>
  );
};
