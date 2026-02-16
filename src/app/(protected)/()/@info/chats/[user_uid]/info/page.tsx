import { getChatById } from 'modules/conversation/messages-chat/utils/get-chat-by-id';
//import { ProfileBlock } from 'modules/profile';
import { JSX } from 'react';

export default async function InfoPage({ params }: { params: Promise<{ user_uid: string }> }): Promise<JSX.Element> {
  const user_uid = (await params).user_uid;
  const { chat } = getChatById(user_uid)[0];

  return <></>;
}
