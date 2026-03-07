import { MessagesListScreen } from 'modules/conversation/messages-chat/screens';
import { JSX, Suspense } from 'react';

export default async function MessagesPage({
  params,
}: {
  params: Promise<{ user_uid: string }>;
}): Promise<JSX.Element> {
  const user_uid = (await params).user_uid;
  return (
    <>
      <Suspense>
        <MessagesListScreen user_uid={user_uid} />
      </Suspense>
    </>
  );
}
