'use client';

import { DeleteSelectedContactsButton } from 'modules/conversation/contacts/features/contacts-selection';
import { ConversationEmptyState, ConversationLayout, SearchInput } from 'modules/conversation/shared/ui';
import { JSX } from 'react';

export const ChatsBlock = (): JSX.Element => {
  return (
    <ConversationLayout
      header={<SearchInput query={''} onChange={() => 'void'} />}
      footer={<DeleteSelectedContactsButton />}
    >
      <>
        <ConversationEmptyState variant={'chats'} />
      </>
    </ConversationLayout>
  );
};
