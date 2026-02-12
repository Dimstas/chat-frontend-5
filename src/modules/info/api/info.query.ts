import { useMutation, UseMutationResult, useQuery, useQueryClient, UseQueryResult } from '@tanstack/react-query';
import { blockUser, getProfileInfoById, mapInfoProfileFromApi } from '.';
import { ProfileInfo } from '../entity/info.entity';
import { BlockProfileApiResponse } from '../model/info.api.schema';
import { unblockUser } from './info.api';

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

export const useBlockUserMutation = (id: string): UseMutationResult<BlockProfileApiResponse, Error, void> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['block', 'contact', id],

    mutationFn: async () => {
      return await blockUser(id);
    },

    onSuccess: () => {
      console.log('Пользователь заблокирован');
    },

    onError: (error: Error) => {
      console.error('Ошибка POST‑запроса:', error);
    },

    onSettled: () => {
      void queryClient.invalidateQueries({
        queryKey: ['info', 'contact', id],
      });
    },
  });
};

export const useUnblockUserMutation = (id: string): UseMutationResult<void, Error, void> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['unblock', 'contact', id],

    mutationFn: async () => {
      await unblockUser(id);
    },

    onSuccess: () => {
      console.log('Пользователь разблокирован');
    },

    onError: (error: Error) => {
      console.error('Ошибка DELETE‑запроса:', error);
    },

    onSettled: () => {
      void queryClient.invalidateQueries({
        queryKey: ['info', 'contact', id],
      });
    },
  });
};
