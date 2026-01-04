import { ContactApi } from 'modules/conversation/contacts/entity';
import { apiFetch } from 'shared/api/fetcher';

export type GetContactsListParams = {
  page?: number;
  page_size?: number;
  ordering?: string;
};

export type GetContactsListResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: ContactApi[];
};

export const getContactsList = (params: GetContactsListParams): Promise<GetContactsListResponse> => {
  const searchParams = new URLSearchParams();

  if (params.page) searchParams.set('page', String(params.page));
  if (params.page_size) searchParams.set('page_size', String(params.page_size));
  if (params.ordering) searchParams.set('ordering', params.ordering);

  return apiFetch<GetContactsListResponse>(`/api/proxy/contacts/get-contacts/?${searchParams.toString()}`, {
    method: 'GET',
  });
};
