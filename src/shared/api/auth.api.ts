import { apiFetch } from './fetcher';

export type GetCodePayload = {
  phone_number: string;
};

export type GetCodeResponse = {
  phone_number: string;
  code_len: number;
};

export const getAuthCode = (data: GetCodePayload): Promise<GetCodeResponse> => {
  return apiFetch<GetCodeResponse>('/api/auth/get-code', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export type GetTokenPayload = {
  phone_number: string;
  code: string;
};

export type GetTokenResponse = {
  is_filled: boolean;
};

export const getAuthToken = (data: GetTokenPayload): Promise<GetTokenResponse> => {
  return apiFetch<GetTokenResponse>('/api/auth/get-token', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export type GetUniqueNameCheckResponse = {
  is_unique: boolean;
};

export const checkUniqueName = (nickname: string): Promise<GetUniqueNameCheckResponse> => {
  const url = new URL('/api/proxy/unique-name-check', window.location.origin);
  url.searchParams.set('nickname', nickname);
  return apiFetch<GetUniqueNameCheckResponse>(url.toString(), {
    method: 'GET',
  });
};
