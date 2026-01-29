import { getMessageDate } from 'modules/conversation/messages-chat/lib/get-message-date';
import type { ChatResult } from './definitions';

export const handlerMessagesList = (messagesList: ChatResult[]): { [date: string]: ChatResult[] } => {
  const groupedMessagesList = messagesList.reduce<{ [date: string]: ChatResult[] }>((acc, message) => {
    const date = getMessageDate(message.created_at);
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(message);
    return acc;
  }, {});

  return groupedMessagesList;
};
