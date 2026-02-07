import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { ProfileInfo } from '../entity/info.entity';
import { getProfileInfoById } from './info.api';
import { mapInfoProfileFromApi } from './info.contact.mapper';

export const useInfoProfileQuery = (id: string): UseQueryResult<ProfileInfo> => {
  return useQuery({
    queryKey: ['info', 'contact', id],
    queryFn: async ({ signal }) => {
      return await getProfileInfoById(id, { signal });
    },

    select: (data) => mapInfoProfileFromApi(data),

    enabled: !!id,
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
  });
};
