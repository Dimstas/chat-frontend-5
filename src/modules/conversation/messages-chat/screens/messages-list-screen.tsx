'use client';
import { JSX, useEffect } from 'react';
import { useWebSocketChat } from '../api/web-socket/use-web-socket-chat';
import { DefaultMessagesPage } from '../ui/default-messages-page';
import { MessagesList } from '../ui/messages-list/messages-list';
import { useUserIdStore } from '../zustand-store/zustand-store';
import { MessagesListScreenProps } from './messades-list-screen.props';
import { useMessagesListScreen } from './use-messages-list-screen';

export const MessagesListScreen = ({ user_uid, wsUrl, currentUserId }: MessagesListScreenProps): JSX.Element => {
  const userIdStore = useUserIdStore((s) => s.userId);
  const setUserIdStore = useUserIdStore((s) => s.setUserId);

  useEffect(() => {
    setUserIdStore(user_uid);
  }, [user_uid, setUserIdStore]);

  const { messagesList, status, fetchNextPage, hasNextPage, isFetchingNextPage } = useMessagesListScreen(userIdStore);
  const { sendChangeStatusReadMessage, sendDeleteMessage } = useWebSocketChat(wsUrl, currentUserId);

  if (status === 'success' && messagesList.length > 0) {
    return (
      <MessagesList
        messagesList={messagesList}
        currentUserId={currentUserId}
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        sendChangeStatusReadMessage={sendChangeStatusReadMessage}
        sendDeleteMessage={sendDeleteMessage}
      />
    );
  } else {
    if (status === 'success' && messagesList.length === 0) {
      return <DefaultMessagesPage />;
    } else {
      return <></>;
    }
  }
};
