import { MessagesList } from 'modules/conversation/messages-chat/ui/messages-list/messages-list';
import { JSX, Suspense } from 'react';

export default async function MessagesPage({
  params,
}: {
  params: Promise<{ user_uid: string }>;
}): Promise<JSX.Element> {
  const user_uid = (await params).user_uid;
  return (
    <Suspense>
      <MessagesList user_uid={user_uid} />
    </Suspense>
  );
}
