import { ContactQuery, GlobalContactApi, UserContactApiResponse } from 'modules/conversation/contacts/model/contact';
import { NewContact } from 'modules/info/model/info.api.schema';
import { apiFetch } from 'shared/api';

export const getContactsList = (params: ContactQuery): Promise<UserContactApiResponse> => {
  const searchParams = new URLSearchParams();

  if (params.page) searchParams.set('page', String(params.page));
  if (params.page_size) searchParams.set('page_size', String(params.page_size));
  if (params.ordering) searchParams.set('ordering', params.ordering);

  return apiFetch<UserContactApiResponse>(`/api/proxy/api/v1/contact/messenger-list/?${searchParams.toString()}`, {
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

  return apiFetch<GlobalContactApi[]>('/api/proxy/api/v1/contact/check/list/', {
    method: 'POST',
    body: JSON.stringify(data),
    signal,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const addToContact = async (
  contact: NewContact,
  { signal }: { signal?: AbortSignal } = {},
): Promise<UserContactApiResponse> => {
  return apiFetch<UserContactApiResponse>(`/api/proxy/api/v1/contact/messenger-add-by-phone/`, {
    method: 'POST',
    body: JSON.stringify(contact),
    signal,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
