'use client';
import { JSX, useEffect } from 'react';
import { DefaultMessagesPage } from '../ui/default-messages-page';
import { MessagesList } from '../ui/messages-list/messages-list';
import { useUserIdStore } from '../zustand-store/zustand-store';
import { useMessagesListScreen } from './use-messages-list-screen';

export const MessagesListScreen = ({ user_uid }: { user_uid: string }): JSX.Element => {
  const userIdStore = useUserIdStore((s) => s.userId);
  const setUserIdStore = useUserIdStore((s) => s.setUserId);
  useEffect(() => {
    setUserIdStore(user_uid);
  }, [user_uid, setUserIdStore]);
  const { messagesList, status } = useMessagesListScreen(userIdStore);
  if (status === 'success' && messagesList.length > 0) {
    return <MessagesList messagesList={messagesList} />;
  } else {
    if (status === 'success' && messagesList.length === 0) {
      return <DefaultMessagesPage />;
    } else {
      return <></>;
    }
  }
};
