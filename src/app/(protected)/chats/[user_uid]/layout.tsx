import { HeaderBottom } from 'modules/conversation/messages-chat/ui/header-bottom';
import { HeaderTop } from 'modules/conversation/messages-chat/ui/header-top';
import styles from 'modules/conversation/messages-chat/ui/messages-list-layout/messages-list-layout.module.scss';

import { JSX, Suspense } from 'react';

export default async function MessagesLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ user_uid: string }>;
}): Promise<JSX.Element> {
  const user_uid = (await params).user_uid;

  return (
    <main className={styles.wrapper}>
      <Suspense>
        <HeaderTop user_uid={user_uid} />
      </Suspense>
      {children}
      <HeaderBottom />
    </main>
  );
}
