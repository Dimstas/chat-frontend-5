'use client';

import { useContactsQuery, useSearchUsersQuery } from 'modules/conversation/contacts/api';
import { Contact } from 'modules/conversation/contacts/entity';
import { useSearchStore } from 'modules/conversation/contacts/model/search';
import { useDebouncedValue } from 'modules/conversation/shared/hooks';

type UseContactsScreenReturn = {
  query: string;
  setQuery: (q: string) => void;
  clearQuery: () => void;
  contacts: Contact[] | undefined;
  globals: Contact[] | undefined;
};

export const useContactsScreen = (): UseContactsScreenReturn => {
  const query = useSearchStore((s) => s.query);
  const setQuery = useSearchStore((s) => s.setQuery);
  const clearQuery = useSearchStore((s) => s.clearQuery);

  const debouncedQuery = useDebouncedValue(query, 300);

  const { data: myContacts } = useContactsQuery();
  const { data: globals } = useSearchUsersQuery(debouncedQuery);

  const myContactUids = new Set(myContacts?.map((c) => c.uid) ?? []);

  const filteredGlobals = globals?.filter((c) => !myContactUids.has(c.uid));

  const normalizedQuery = query.trim().toLowerCase();

  const filteredContacts = normalizedQuery
    ? myContacts?.filter((c) => c.fullName.toLowerCase().includes(normalizedQuery))
    : myContacts;

  return {
    query,
    setQuery,
    clearQuery,

    contacts: filteredContacts,
    globals: filteredGlobals,
  };
};
