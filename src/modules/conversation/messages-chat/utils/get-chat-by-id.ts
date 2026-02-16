import type { ChatApi } from 'modules/conversation/chats/model/chat.api.schema';
import { mockChatListApiResponse } from 'modules/conversation/shared/utils/contact-list';

export const getChatById = (user_id: string): ChatApi[] => {
  if (mockChatListApiResponse.results.length !== 0) {
    return mockChatListApiResponse.results.filter((chat) => chat.chat.uid === user_id);
  } else return [];
};
