import { Contact } from 'modules/conversation/contacts/entity';
import { ContactApi } from './contact.types';

export const mapContactFromApi = (api: ContactApi): Contact => {
  const { uid, phone, first_name, last_name } = api;
  const fullName = `${first_name} ${last_name}`;
  const nickname = 'nickname' in api ? api.nickname : '';

  if ('system_contact' in api) {
    const { uid, avatar_url, is_online, was_online_at } = api.system_contact;
    return {
      uid,
      phone,
      firstName: first_name,
      lastName: last_name,
      fullName,
      nickname,
      avatarUrl: avatar_url,
      isOnline: is_online,
      wasOnlineAt: was_online_at,
    };
  }

  const { chat_id, avatar_url, is_online, was_online_at } = api;
  return {
    uid,
    phone,
    nickname,
    firstName: first_name,
    lastName: last_name,
    chatId: chat_id,
    fullName,
    avatarUrl: avatar_url,
    isOnline: is_online,
    wasOnlineAt: was_online_at,
  };
};
