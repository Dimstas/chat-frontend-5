'use client';
import { JSX, Suspense } from 'react';
import { DefaultMessagesPage } from '../ui/default-messages-page';
import { MessagesList } from '../ui/messages-list/messages-list';
import { useMessagesListScreen } from './use-messages-list-screen';

export const MessagesListScreen = ({ user_uid }: { user_uid: string }): JSX.Element => {
  const { messagesList, status } = useMessagesListScreen(user_uid);

  if (status === 'success' && messagesList.length > 0) {
    return (
      <Suspense>
        <MessagesList user_uid={user_uid} messagesList={messagesList} />
      </Suspense>
    );
  } else {
    if (status === 'success' && messagesList.length === 0) {
      return <DefaultMessagesPage />;
    } else {
      return <></>;
    }
  }
};
