import { useChatsScreen } from 'modules/conversation/chats/screens/use-chats-screen';
import { useInfoStore } from 'modules/info/model/info.store';
import { JSX } from 'react';
import { InfoGroupBlockProps } from './info-group-block.props';

export const InfoGroupBlock = ({ uid, wsUrl, currentUid, chatKey }: InfoGroupBlockProps): JSX.Element => {
  const { chatId } = useInfoStore();
  const { chats } = useChatsScreen();

  const chat = chats.find((c) => c.chat.id === chatId);

  return <></>;
};
