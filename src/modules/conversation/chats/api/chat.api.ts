import { ChatListApiResponse, ChatQuery } from 'modules/conversation/chats/model';
import { apiFetch } from 'shared/api';

export const getChatList = (params: ChatQuery): Promise<ChatListApiResponse> => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value == null) return;

    searchParams.set(key, String(value));
  });

  return apiFetch<ChatListApiResponse>(`/api/proxy/api/v1/chat/list/?${searchParams.toString()}`, {
    method: 'GET',
  });
};
