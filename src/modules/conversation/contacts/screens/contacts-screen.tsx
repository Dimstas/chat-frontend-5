import { DeleteSelectedContactsButton } from 'modules/conversation/contacts/features/contacts-selection/ui/delete-selected-button';
import { DeleteSelectedContactsModal } from 'modules/conversation/contacts/features/contacts-selection/ui/delete-selected-contacts-modal';
import { ContactsPanel } from 'modules/conversation/contacts/widgets/contacts-panel/';
import { ConversationListLayout, SearchInput } from 'modules/conversation/shared/ui';
import { JSX } from 'react';

export const ContactsScreen = (): JSX.Element => {
  return (
    <>
      <ConversationListLayout header={<SearchInput />} footer={<DeleteSelectedContactsButton />}>
        <ContactsPanel />
        <ContactsPanel />
      </ConversationListLayout>
      <DeleteSelectedContactsModal />
    </>
  );
};
