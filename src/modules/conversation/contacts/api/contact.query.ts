'use client';

import { useInfiniteQuery, UseInfiniteQueryResult, useQuery, UseQueryResult } from '@tanstack/react-query';
import { Contact } from 'modules/conversation/contacts/entity';
import { mapContactFromApi, UserContactApiResponse } from 'modules/conversation/contacts/model/contact';
import { getContactsList, searchUsers } from './contact.api';

const PAGE_SIZE = 15;

export const useContactsQuery = (): UseInfiniteQueryResult<Contact[], unknown> => {
  return useInfiniteQuery<UserContactApiResponse, unknown, Contact[], ['contacts', 'contacts-list'], number>({
    queryKey: ['contacts', 'contacts-list'],
    initialPageParam: 1,

    queryFn: async ({ pageParam }) => {
      return getContactsList({
        page: pageParam,
        page_size: PAGE_SIZE,
        ordering: '-system_contact__was_online_at',
      });
    },

    select: (data) => data.pages.flatMap((page) => page.results.map(mapContactFromApi)),

    getNextPageParam: (lastPage) => {
      if (!lastPage.next) return undefined;
      const url = new URL(lastPage.next, 'http://localhost');
      return Number(url.searchParams.get('page'));
    },
  });
};

export const useSearchUsersQuery = (query: string): UseQueryResult<Contact[]> => {
  return useQuery({
    queryKey: ['search', 'users', query],
    queryFn: async ({ signal }) => {
      return await searchUsers(query, { signal });
    },

    select: (data) => data.map(mapContactFromApi),

    enabled: query.length >= 2,
    placeholderData: (previousData) => previousData,
    staleTime: 10_000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};
