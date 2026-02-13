import { UserContactApiResponse } from 'modules/conversation/contacts/model/contact';
import { apiFetch } from 'shared/api';
import {
  BlockProfileApiResponse,
  ChatPost,
  ChatPostApiResponse,
  InfoProfileApiResponse,
  NewContact,
} from '../model/info.api.schema';

export const getProfileInfoById = (
  id: string,
  { signal }: { signal?: AbortSignal } = {},
): Promise<InfoProfileApiResponse> => {
  return apiFetch<InfoProfileApiResponse>(`/api/proxy/api/v1/contact/${id}`, {
    method: 'GET',
    signal,
  });
};

export const blockUser = (uid: string): Promise<BlockProfileApiResponse> => {
  return apiFetch<BlockProfileApiResponse>(`/api/proxy/api/v1/contact/blacklist/add/${uid}/`, {
    method: 'POST',
    body: undefined,
  });
};

export const unblockUser = async (uid: string): Promise<void> => {
  await apiFetch<void>(`/api/proxy/api/v1/contact/blacklist/delete/${uid}/`, { method: 'DELETE' });
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

export const editChat = async (
  chatPost: ChatPost,
  chatId: number,
  { signal }: { signal?: AbortSignal } = {},
): Promise<ChatPostApiResponse> => {
  return apiFetch<ChatPostApiResponse>(`/api/proxy/api/v1/chat/list/${chatId}/`, {
    method: 'POST',
    body: JSON.stringify(chatPost),
    signal,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
