'use client';

import { Chat } from 'modules/conversation/chats/entity/chat.entity';
import { useDebouncedValue } from 'modules/conversation/shared/hooks';
import { useMemo } from 'react';
import { useChatsQuery } from '../api/chat.query';
import { mapChatFromApi } from '../model/chat';
import { useChatsStore } from '../model/search/search-chats.store';

type UseChatsScreenReturn = {
  ordering: string;
  setOrdering: (q: string) => void;
  clearOrdering: () => void;
  search: string;
  setSearch: (q: string) => void;
  clearSearch: () => void;
  is_active: boolean;
  setIsActive: (q: boolean) => void;
  is_blocked: boolean;
  setIsBlocked: (q: boolean) => void;
  is_favorite: boolean;
  setIsFavorite: (q: boolean) => void;
  chats: Chat[];
};

export const useChatsScreen = (): UseChatsScreenReturn => {
  const ordering = useChatsStore((s) => s.ordering);
  const setOrdering = useChatsStore((s) => s.setOrdering);
  const clearOrdering = useChatsStore((s) => s.clearOrdering);

  const search = useChatsStore((s) => s.search);
  const setSearch = useChatsStore((s) => s.setSearch);
  const clearSearch = useChatsStore((s) => s.clearSearch);

  const is_active = useChatsStore((s) => s.is_active);
  const setIsActive = useChatsStore((s) => s.setIsActive);

  const is_blocked = useChatsStore((s) => s.is_blocked);
  const setIsBlocked = useChatsStore((s) => s.setIsBlocked);

  const is_favorite = useChatsStore((s) => s.is_favorite);
  const setIsFavorite = useChatsStore((s) => s.setIsFavorite);

  const debouncedOrdering = useDebouncedValue<string>(ordering, 300);
  const debouncedSearch = useDebouncedValue<string>(search, 300);

  const { data: myChats } = useChatsQuery();

  const chats = useMemo(() => myChats?.pages.flatMap((page) => page.results.map(mapChatFromApi)) ?? [], [myChats]);

  const normalizedSearch = search.trim().toLowerCase();
  const filteredChats = normalizedSearch
    ? chats?.filter((c) => `${c.peer.firstName} ${c.peer.lastName}`.toLowerCase().includes(normalizedSearch))
    : chats;

  const sortedChats = filteredChats.sort((a, b) => {
    if (a.chat.is_favorite !== b.chat.is_favorite) {
      return a.chat.is_favorite ? -1 : 1;
    }

    const aCreatedAt = a.messages.lastMessage?.createdAt || 0;
    const bCreatedAt = b.messages.lastMessage?.createdAt || 0;

    return bCreatedAt - aCreatedAt;
  });

  return {
    ordering,
    setOrdering,
    clearOrdering,
    search,
    setSearch,
    clearSearch,
    is_active,
    setIsActive,
    is_blocked,
    setIsBlocked,
    is_favorite,
    setIsFavorite,
    chats: sortedChats,
  };
};
