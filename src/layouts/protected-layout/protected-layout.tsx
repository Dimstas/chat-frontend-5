'use client';
import clsx from 'clsx';
import { usePathname } from 'next/navigation';
import { JSX } from 'react';
import { Header } from './header';
import styles from './protected-layout.module.scss';
import { ProtectedLayoutProps } from './protected-layout.props';

export const ProtectedLayout = ({ nav, list, main, info }: ProtectedLayoutProps): JSX.Element => {
  const pathname = usePathname();
  const exists = pathname.includes('info');
  return (
    <div className={styles.root}>
      <Header />
      <div className={styles.shell}>
        <div className={clsx(styles.mainGrid, exists ? styles.mainGridInfo : styles.mainGridNotInfo)}>
          <aside className={styles.nav}>{nav}</aside>
          <aside className={styles.list}>{list}</aside>
          <main className={styles.main}>{main}</main>
          {exists && <div>{info}</div>}
        </div>
      </div>
    </div>
  );
};
