import { getMessageDate } from 'modules/conversation/messages-chat/lib/get-message-date';
import type { RestMessageApi } from '../model/messages-list';

export const handlerMessagesList = (
  messagesList: (RestMessageApi & { status?: 'pending' | 'sent' | 'failed' })[],
): { [date: string]: (RestMessageApi & { status?: 'pending' | 'sent' | 'failed' })[] } => {
  const groupedMessagesList = messagesList.reduce<{
    [date: string]: (RestMessageApi & { status?: 'pending' | 'sent' | 'failed' })[];
  }>((acc, message: RestMessageApi & { status?: 'pending' | 'sent' | 'failed' }) => {
    const date = getMessageDate(message.created_at);
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(message);
    return acc;
  }, {});

  return groupedMessagesList;
};
