import { HeaderBottom } from 'modules/conversation/messages-chat/ui/header-bottom';
import { HeaderTop } from 'modules/conversation/messages-chat/ui/header-top';
import styles from 'modules/conversation/messages-chat/ui/messages-list-layout/messages-list-layout.module.scss';
import { cookies } from 'next/headers';
import { Suspense } from 'react';

const BACKEND_WS = process.env.BACKEND_API_WS_URL!;

export default async function MessagesLayout({ children }: { children: React.ReactNode }): Promise<React.ReactNode> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access')?.value;
    const wsUrl = `${BACKEND_WS}/ws/chat?authorization=${accessToken}`;

    return (
      <main className={styles.wrapper}>
        <Suspense>
          <HeaderTop />
        </Suspense>
        {children}
        <Suspense>
          <HeaderBottom wsUrl={wsUrl} />
        </Suspense>
      </main>
    );
  } catch (error) {
    console.error(error);
  }
}
