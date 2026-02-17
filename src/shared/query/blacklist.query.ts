import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { getBlacklist, BlacklistResponse, GetBlacklistParams } from '../api/blacklist.api';

/**
 * Хук для получения черного списка (заблокированных пользователей).
 * @param params - Параметры запроса (ordering, page, page_size)
 * @returns UseQueryResult<BlacklistResponse>
 */
export const useGetBlacklist = (
  params?: GetBlacklistParams,
): UseQueryResult<BlacklistResponse, unknown> => {
  return useQuery({
    queryKey: ['blacklist', params], 
    queryFn: () => getBlacklist(params), 
  });
};