'use client';

import { ChatCard } from 'modules/conversation/chats/entity/ui';
import { DeleteSelectedContactsButton } from 'modules/conversation/contacts/features/contacts-selection';
import { ConversationLayout, SearchInput } from 'modules/conversation/shared/ui';
import { JSX } from 'react';
import { useChatsScreen } from '../../screens/use-chats-screen';
import { AddContactModal } from '../add-contact-modal';
import { DeleteChatModal } from '../delete-chat-modal';

// const chats = mockChatListApiResponse.results.map((r) => mapChatFromApi(r));

export const ChatsBlock = (): JSX.Element => {
  const {
    ordering,
    setOrdering,
    clearOrdering,
    search,
    setSearch,
    clearSearch,
    is_active,
    setIsActive,
    is_blocked,
    setIsBlocked,
    is_favorite,
    setIsFavorite,
    chats,
  } = useChatsScreen();
  return (
    <>
      <ConversationLayout
        header={<SearchInput query={search} onChange={setSearch} />}
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
      <DeleteChatModal />
      <AddContactModal />
    </>
  );
};
