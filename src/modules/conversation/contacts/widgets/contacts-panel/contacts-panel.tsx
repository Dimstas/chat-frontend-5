'use client';

import { ContactCardSelectable } from 'modules/conversation/contacts/features/contacts-selection/ui/contact-card-selectable/contact-card-selectable';
import { SectionHeaderFeature } from 'modules/conversation/contacts/features/section-header-feature/section-header-feature';
import { useContactsQuery } from 'modules/conversation/contacts/api/use-contacts.query';
import { JSX } from 'react';

export const ContactsPanel = (): JSX.Element => {
  const { data: myContacts } = useContactsQuery();

  return (
    <div>
      <SectionHeaderFeature variant={'personal'} />
      {myContacts &&
        myContacts.map((contact) => (
          <ContactCardSelectable
            key={contact.uid}
            uid={contact.uid}
            avatar={contact.avatar}
            wasOnlineAt={contact.wasOnlineAt}
            fullName={contact.fullName}
          />
        ))}
    </div>
  );
};
