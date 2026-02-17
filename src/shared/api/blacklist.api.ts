import { apiFetch } from './fetcher';

export type BlacklistedUser = {
  uid: string;
  username: string;
  nickname: string;
  first_name: string;
  last_name: string;
  patronymic: string;
  additional_information: string;
  birthday: number;
  email: string;
  gender: string;
  gender_label: string;
  country: string;
  country_label: string;
  city_id: number;
  city: string;
  phone: string;
  avatar: string;
  avatar_url: string;
  avatar_webp: string;
  avatar_webp_url: string;
  is_doctor: boolean;
  is_confirmed_doctor: boolean;
  is_filled: boolean;
  is_staff: boolean;
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