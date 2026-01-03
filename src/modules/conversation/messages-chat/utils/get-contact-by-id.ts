import { CONTACTS_LIST } from 'modules/conversation/shared/utils/contact-list';

type ChatContact = {
  uid: string;
  avatar: string;
  first_name: string;
  last_name: string;
  status: number;
};

export const getContactById = (user_id: string): ChatContact[] => {
  if (CONTACTS_LIST.length !== 0) {
    return CONTACTS_LIST.filter((contact) => contact.uid === user_id);
  } else return [];
};
