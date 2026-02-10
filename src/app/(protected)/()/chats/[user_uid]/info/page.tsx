import { handlerMessagesList } from 'modules/conversation/messages-chat/lib/handler-messages-list';
import { MessagesList } from 'modules/conversation/messages-chat/ui/messages-list/messages-list';
import { messagesListDefault } from 'modules/conversation/messages-chat/utils/messades-placeholder';
import { JSX, Suspense } from 'react';

export default async function MessagesPage({
  params,
}: {
  params: Promise<{ user_uid: string }>;
}): Promise<JSX.Element> {
  const user_uid = (await params).user_uid;

  // должен быть GET запрос на /api/v1/chat/message/text/{user_uid}/ для получения cписка сообщений чата по user_uid

  // Группировка сообщений по дате
  const results = handlerMessagesList(messagesListDefault.results);

  return (
    <Suspense>
      <MessagesList results={results} />
    </Suspense>
  );
}
