import { messagesListDefault } from 'modules/conversation/messages-chat/utils/messades-placeholder';
import type { ChatResult } from '../lib/definitions';

export const getMessagesById = (user_id: string): ChatResult[] => {
  return messagesListDefault?.results?.filter((message) => message.uid === user_id) || [];
};
