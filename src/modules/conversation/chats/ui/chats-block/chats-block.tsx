'use client';

import { ChatCard } from 'modules/conversation/chats/entity/ui';
import { DeleteSelectedContactsButton } from 'modules/conversation/contacts/features/contacts-selection';
import { ConversationLayout, SearchInput } from 'modules/conversation/shared/ui';
import { JSX, useEffect, useMemo } from 'react';
import { useChatsQuery } from '../../api/chat.query';
import { mapChatFromApi } from '../../model';
import { useChatStore } from '../../model/chat.store';

// const chats = mockChatListApiResponse.results.map((r) => mapChatFromApi(r));

export const ChatsBlock = (): JSX.Element => {
  const { data: myChats } = useChatsQuery();
  const { setChats } = useChatStore();

  const chats = useMemo(() => myChats?.pages.flatMap((page) => page.results.map(mapChatFromApi)) ?? [], [myChats]);

  useEffect(() => {
    setChats(chats);
  }, [chats, setChats]);

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
