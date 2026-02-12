import { InfiniteData, useInfiniteQuery, UseInfiniteQueryResult } from '@tanstack/react-query';
import { ChatListApiResponse } from 'modules/conversation/chats/model/chat';
import { getChatList } from './chat.api';

const PAGE_SIZE = 15;

export const useChatsQuery = (
  ordering: string,
  search: string,
  is_active: boolean,
  is_blocked: boolean,
  is_favorite: boolean,
): UseInfiniteQueryResult<InfiniteData<ChatListApiResponse>, unknown> => {
  return useInfiniteQuery<
    ChatListApiResponse,
    unknown,
    InfiniteData<ChatListApiResponse>,
    ['chats', 'chat-list', string, string, boolean, boolean, boolean],
    number
  >({
    queryKey: ['chats', 'chat-list', ordering, search, is_active, is_blocked, is_favorite],
    initialPageParam: 1,

    queryFn: ({ pageParam }) =>
      getChatList({
        is_active,
        is_blocked,
        is_favorite,
        ordering,
        search,
        page: pageParam,
        page_size: PAGE_SIZE,
      }),

    getNextPageParam: (lastPage) => {
      if (!lastPage.next) return undefined;
      const url = new URL(lastPage.next, 'http://localhost');
      return Number(url.searchParams.get('page'));
    },
  });
};
