'use client';
import { JSX, useEffect } from 'react';
import { DefaultMessagesPage } from '../ui/default-messages-page';
import { MessagesList } from '../ui/messages-list/messages-list';
import { useUserIdStore } from '../zustand-store/zustand-store';
import { useMessagesListScreen } from './use-messages-list-screen';

export const MessagesListScreen = ({
  user_uid,
  wsUrl,
  currentUserId,
}: {
  user_uid: string;
  wsUrl: string;
  currentUserId: string;
}): JSX.Element => {
  const userIdStore = useUserIdStore((s) => s.userId);
  const setUserIdStore = useUserIdStore((s) => s.setUserId);
  useEffect(() => {
    setUserIdStore(user_uid);
  }, [user_uid, setUserIdStore]);
  const { messagesList, status } = useMessagesListScreen(userIdStore);
  if (status === 'success' && messagesList.length > 0) {
    return <MessagesList messagesList={messagesList} wsUrl={wsUrl} currentUserId={currentUserId} />;
  } else {
    return <DefaultMessagesPage />;
  }
};
