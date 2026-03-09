import { MessagesListScreen } from 'modules/conversation/messages-chat/screens';
import { cookies } from 'next/headers';
import { JSX, Suspense } from 'react';

const BACKEND_WS = process.env.BACKEND_API_WS_URL!;

export default async function MessagesPage({
  params,
}: {
  params: Promise<{ user_uid: string }>;
}): Promise<JSX.Element> {
  const user_uid = (await params).user_uid;
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access')?.value;
  const wsUrl = `${BACKEND_WS}/ws/chat?authorization=${accessToken}`;
  return (
    <>
      <Suspense>
        <MessagesListScreen user_uid={user_uid} wsUrl={wsUrl} />
      </Suspense>
    </>
  );
}
