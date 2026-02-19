import { apiFetch } from './fetcher';

export type BlacklistedUser = {
uid: string,
username: string,
nickname: string,
phone: string,
first_name: string,
last_name: string,
avatar: string,
avatar_url: string,
avatar_webp: string,
avatar_webp_url: string,
additional_information: string,
birthday: number,
chat_id: number,
is_online: boolean,
was_online_at: number
};

export type BlacklistResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: BlacklistedUser[];
};

export type GetBlacklistParams = {
  ordering?: string;
  page?: number;
  page_size?: number;
};

/**
 * Получает список заблокированных пользователей.
 * @param params - Параметры запроса (ordering, page, page_size)
 * @returns Promise<BlacklistResponse>
 */
export const getBlacklist = (
  params?: GetBlacklistParams,
): Promise<BlacklistResponse> => {
  const url = new URL('/api/proxy/api/v1/contact/blacklist/', window.location.origin);

  if (params) {
    if (params.ordering) url.searchParams.append('ordering', params.ordering);
    if (params.page) url.searchParams.append('page', String(params.page));
    if (params.page_size) url.searchParams.append('page_size', String(params.page_size));
  }

  return apiFetch<BlacklistResponse>(url.toString(), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};