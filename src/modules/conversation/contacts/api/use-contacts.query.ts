'use client';

import { useInfiniteQuery, UseInfiniteQueryResult } from '@tanstack/react-query';
import { Contact, mapContactFromApi } from 'modules/conversation/contacts/entity';
import { getContactsList } from './index';

export type ContactsPage = {
  count: number;
  next: string | null;
  previous: string | null;
  results: Contact[];
};

const PAGE_SIZE = 10;

export const useContactsQuery = (): UseInfiniteQueryResult<Contact[], unknown> => {
  return useInfiniteQuery<ContactsPage, unknown, Contact[], ['contacts', 'messenger-list'], number>({
    queryKey: ['contacts', 'messenger-list'],
    initialPageParam: 1,

    queryFn: async ({ pageParam }) => {
      const response = await getContactsList({
        page: pageParam,
        page_size: PAGE_SIZE,
        ordering: '-system_contact__was_online_at',
      });

      return {
        ...response,
        results: response.results.map(mapContactFromApi),
      };
    },

    select: (data) => data.pages.flatMap((p) => p.results),

    getNextPageParam: (lastPage) => {
      if (!lastPage.next) return undefined;
      const url = new URL(lastPage.next, 'http://localhost');
      return Number(url.searchParams.get('page'));
    },
  });
};
