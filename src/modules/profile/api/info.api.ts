import { apiFetch } from 'shared/api';
import { InfoProfileApiResponse } from '../model/info.api.schema';

export const getProfileInfoById = (
  id: string,
  { signal }: { signal?: AbortSignal } = {},
): Promise<InfoProfileApiResponse> => {
  return apiFetch<InfoProfileApiResponse>(`/api/proxy/api/v1/contact/${id}`, {
    method: 'GET',
    signal,
  });
};
