import { ConversationEmptyState, ConversationListLayout } from 'modules/conversation/shared/ui';
import { SearchInput } from 'modules/conversation/shared/ui/search-input/search-input';
import { JSX } from 'react';

export const ChatsBlock = (): JSX.Element => {
  return (
    <ConversationListLayout header={<SearchInput />}>
      <>
        <ConversationEmptyState variant={'chats'} />
      </>
    </ConversationListLayout>
  );
};
