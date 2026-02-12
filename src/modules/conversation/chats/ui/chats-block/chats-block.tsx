'use client';

import { ChatCard } from 'modules/conversation/chats/entity/ui';
import { mapChatFromApi } from 'modules/conversation/chats/model/chat';
import { DeleteSelectedContactsButton } from 'modules/conversation/contacts/features/contacts-selection';
import { ConversationLayout, SearchInput } from 'modules/conversation/shared/ui';
import { mockChatListApiResponse } from 'modules/conversation/shared/utils/contact-list';
import { JSX } from 'react';

const chats = mockChatListApiResponse.results.map((r) => mapChatFromApi(r));

export const ChatsBlock = (): JSX.Element => {
  return (
    <ConversationLayout
      header={<SearchInput query={''} onChange={() => 'void'} />}
      footer={<DeleteSelectedContactsButton />}
    >
      <>
        <ul>
          {chats.map((c) => (
            <ChatCard key={c.peer.uid} peer={c.peer} chat={c.chat} messages={c.messages} />
          ))}
        </ul>

        {/*<ConversationEmptyState variant={'chats'} />*/}
      </>
    </ConversationLayout>
  );
};
