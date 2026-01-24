import { InfiniteData, useInfiniteQuery, UseInfiniteQueryResult } from '@tanstack/react-query';
import { ChatListApiResponse } from 'modules/conversation/chats/model';
import { getChatList } from './chat.api';

const PAGE_SIZE = 15;

export const useChatsQuery = (): UseInfiniteQueryResult<InfiniteData<ChatListApiResponse>, unknown> => {
  return useInfiniteQuery<
    ChatListApiResponse,
    unknown,
    InfiniteData<ChatListApiResponse>,
    ['chats', 'chat-list'],
    number
  >({
    queryKey: ['chats', 'chat-list'],
    initialPageParam: 1,

    queryFn: ({ pageParam }) =>
      getChatList({
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
