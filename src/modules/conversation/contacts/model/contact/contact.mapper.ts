import { Contact } from 'modules/conversation/contacts/entity';
import { ContactApi } from './contact.types';

export const mapContactFromApi = (api: ContactApi): Contact => {
  const { uid, first_name, last_name } = api;
  const fullName = `${first_name} ${last_name}`;

  if ('system_contact' in api) {
    const { avatar_url, was_online_at } = api.system_contact;
    return {
      uid,
      fullName,
      avatar: avatar_url,
      wasOnlineAt: was_online_at,
    };
  }

  const { avatar_url, was_online_at } = api;
  return {
    uid,
    fullName,
    avatar: avatar_url,
    wasOnlineAt: was_online_at,
  };
};
