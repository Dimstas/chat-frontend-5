import { useMutation, UseMutationResult, useQuery, useQueryClient, UseQueryResult } from '@tanstack/react-query';
import { searchUsers } from 'modules/conversation/contacts/api';
import { GlobalContactApi, UserContactApiResponse } from 'modules/conversation/contacts/model/contact';
import { blockUser, getProfileInfoById, mapInfoProfileFromApi } from '.';
import { ProfileInfo } from '../entity/info.entity';
import { BlockProfileApiResponse, ChatPost, ChatPostApiResponse, NewContact } from '../model/info.api.schema';
import { addToContact, editChat, unblockUser } from './info.api';

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

export const useSearchUserByNicknameQuery = (query: string): UseQueryResult<GlobalContactApi[]> => {
  return useQuery({
    queryKey: ['search', 'user', query],
    queryFn: async ({ signal }) => {
      return await searchUsers(query, { signal });
    },

    enabled: !!query,
    placeholderData: (previousData) => previousData,
    staleTime: 10_000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
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
      console.log('Инвалидация blacklist query');

      void queryClient.invalidateQueries({
        queryKey: ['blacklist'],
      });
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
        queryKey: ['blacklist'],
      });

      void queryClient.invalidateQueries({
        queryKey: ['info', 'contact', id],
      });
    },
  });
};

export const useAddContactQuery = (): UseMutationResult<UserContactApiResponse, Error, NewContact> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['add', 'contact'],

    mutationFn: async (contact) => {
      return await addToContact(contact);
    },

    onSuccess: () => {
      console.log('Пользователь добавлен в контакты');
    },

    onError: (error: Error) => {
      console.error('Ошибка POST‑запроса:', error);
    },

    onSettled: () => {
      void queryClient.invalidateQueries({
        queryKey: ['chats', 'chat-list'],
      });
    },
  });
};

export const useEditChatQuery = (chatId: number): UseMutationResult<ChatPostApiResponse, Error, ChatPost> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['edit', 'chat', chatId],

    mutationFn: async (chatPost) => {
      return await editChat(chatPost, chatId);
    },

    onSuccess: () => {
      console.log('Параметры чата изменены');
    },

    onError: (error: Error) => {
      console.error('Ошибка POST‑запроса:', error);
    },

    onSettled: () => {
      void queryClient.invalidateQueries({
        queryKey: ['chats', 'chat-list'],
      });
    },
  });
};
