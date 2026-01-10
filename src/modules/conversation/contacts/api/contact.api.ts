import { ContactQuery, GlobalContactApi, UserContactApiResponse } from 'modules/conversation/contacts/model/contact';
import { apiFetch } from 'shared/api/fetcher';

export const getContactsList = (params: ContactQuery): Promise<UserContactApiResponse> => {
  const searchParams = new URLSearchParams();

  if (params.page) searchParams.set('page', String(params.page));
  if (params.page_size) searchParams.set('page_size', String(params.page_size));
  if (params.ordering) searchParams.set('ordering', params.ordering);

  return apiFetch<UserContactApiResponse>(`/api/proxy/contacts/get-contacts/?${searchParams.toString()}`, {
    method: 'GET',
  });
};

export const searchUsers = async (
  query: string | string[],
  { signal }: { signal?: AbortSignal } = {},
): Promise<GlobalContactApi[]> => {
  const data = (Array.isArray(query) ? query : [query]).map((q) => ({
    phone_or_nickname: q,
  }));

  return apiFetch<GlobalContactApi[]>('/api/proxy/api/v1/contact/check/list', {
    method: 'POST',
    body: JSON.stringify(data),
    signal,
  });
};
