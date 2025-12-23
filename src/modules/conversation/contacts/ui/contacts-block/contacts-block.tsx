import { ContactCard } from 'modules/conversation/contacts/ui/contact-card/contact-card';
import { ContactsSections } from 'modules/conversation/contacts/ui/contacts-section/contacts-sections';
import { ConversationListLayout } from 'modules/conversation/shared/ui';
import { SearchInput } from 'modules/conversation/shared/ui/search-input/search-input';
import { CONTACTS_LIST } from 'modules/conversation/shared/utils/contact-list';
import { JSX } from 'react';

export const ContactsBlock = (): JSX.Element => {
  return (
    <ConversationListLayout header={<SearchInput />}>
      <>
        {/*<ConversationEmptyState variant={'contacts'} />*/}
        <ContactsSections>
          {CONTACTS_LIST.map(
            (c): JSX.Element => (
              <ContactCard
                key={c.uid}
                avatarHref={c.avatar}
                username={c.first_name}
                lastname={c.last_name}
                was_online_at={c.status}
              />
            ),
          )}
        </ContactsSections>
      </>
    </ConversationListLayout>
  );
};
