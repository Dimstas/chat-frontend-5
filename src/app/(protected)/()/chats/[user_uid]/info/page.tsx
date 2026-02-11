import { handlerMessagesList } from 'modules/conversation/messages-chat/lib/handler-messages-list';
import { DefaultMessagesPage } from 'modules/conversation/messages-chat/ui/default-messages-page';
import { MessagesList } from 'modules/conversation/messages-chat/ui/messages-list/messages-list';
import { getMessagesById } from 'modules/conversation/messages-chat/utils/get-messages-by-id';
import { JSX, Suspense } from 'react';

export default async function MessagesInfoPage({
  params,
}: {
  params: Promise<{ user_uid: string }>;
}): Promise<JSX.Element> {
  const user_uid = (await params).user_uid;
  const results = getMessagesById(user_uid);

  // должен быть GET запрос на /api/v1/chat/message/text/{user_uid}/ для получения cписка сообщений чата по user_uid

  // Группировка сообщений по дате

  if (results.length > 0) {
    const resultsByDate = handlerMessagesList(results);
    return (
      <Suspense>
        <MessagesList results={resultsByDate} />
      </Suspense>
    );
  } else {
    return <DefaultMessagesPage />;
  }
}
