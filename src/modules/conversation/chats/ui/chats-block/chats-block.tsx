import { DeleteSelectedContactsButton } from 'modules/conversation/contacts/features/contacts-selection/ui/delete-selected-button';
import { ConversationEmptyState, ConversationListLayout } from 'modules/conversation/shared/ui';
import { SearchInput } from 'modules/conversation/shared/ui/search-input/search-input';
import { JSX } from 'react';

export const ChatsBlock = (): JSX.Element => {
  return (
    <ConversationListLayout header={<SearchInput />} footer={<DeleteSelectedContactsButton />}>
      <>
        <ConversationEmptyState variant={'chats'} />
      </>
    </ConversationListLayout>
  );
};
