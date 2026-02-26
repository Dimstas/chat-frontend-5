import { HeaderBottom } from 'modules/conversation/messages-chat/ui/header-bottom';
import { HeaderTop } from 'modules/conversation/messages-chat/ui/header-top';
import styles from 'modules/conversation/messages-chat/ui/messages-list-layout/messages-list-layout.module.scss';
import { cookies } from 'next/headers';
import { JSX, Suspense } from 'react';

const BACKEND_WS = process.env.BACKEND_API_WS_URL!;

export default async function MessagesLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ user_uid: string }>;
}): Promise<JSX.Element | void> {
  try {
    const user_uid = (await params).user_uid;
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access')?.value;
    const wsUrl = `${BACKEND_WS}/ws/chat?authorization=${accessToken}`;

    return (
      <main className={styles.wrapper}>
        <Suspense>
          <HeaderTop user_uid={user_uid} />
        </Suspense>
        {children}
        <HeaderBottom user_uid={user_uid} wsUrl={wsUrl} />
      </main>
    );
  } catch (error) {
    console.error(error);
  }
}
