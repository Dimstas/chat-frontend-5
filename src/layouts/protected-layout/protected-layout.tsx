'use client';
import clsx from 'clsx';
import { useCallsStore } from 'modules/conversation/messages-chat/model/calls';
import { OutgoingCallPanel } from 'modules/conversation/messages-chat/widgets/outgoing-call-panel';
import { useInfoStore } from 'modules/info/model/info.store';
import { JSX } from 'react';
import styles from './protected-layout.module.scss';
import { ProtectedLayoutProps } from './protected-layout.props';

export const ProtectedLayout = ({ nav, list, main, info }: ProtectedLayoutProps): JSX.Element => {
  const { isInfoOpen } = useInfoStore();
  const { isCallModalOpen } = useCallsStore();

  return (
    <div className={styles.root}>
      <div className={styles.shell}>
        <div className={styles.mainGrid}>
          <aside className={styles.nav}>{nav}</aside>
          <aside className={styles.list}>{list}</aside>
          <main className={styles.main}>{main}</main>
        </div>
        {isInfoOpen && <div className={clsx(styles.info, { [styles.open]: isInfoOpen })}>{info}</div>}
      </div>
      {isCallModalOpen && <OutgoingCallPanel />}
    </div>
  );
};
