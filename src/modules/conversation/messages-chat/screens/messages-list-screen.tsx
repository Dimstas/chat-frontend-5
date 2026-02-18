'use client';
import { JSX, Suspense } from 'react';
import { handlerMessagesList } from '../lib/handler-messages-list';
import { DefaultMessagesPage } from '../ui/default-messages-page';
import { MessagesList } from '../ui/messages-list/messages-list';
import { useMessagesListScreen } from './use-messages-list-screen';

export const MessagesListScreen = ({ user_uid }: { user_uid: string }): JSX.Element => {
  const {
    from_me,
    setFromMe,
    new: newS,
    setNew,
    ordering,
    setOrdering,
    clearOrdering,
    range_time_end_created,
    setRangeTimeEndCreated,
    range_time_end_updated,
    setRangeTimeEndUpdated,
    range_time_start_created,
    setRangeTimeStartCreated,
    range_time_start_updated,
    setRangeTimeStartUpdated,
    search,
    setSearch,
    clearSearch,
    messagesList,
  } = useMessagesListScreen(user_uid);

  if (messagesList.length > 0) {
    const resultsByDate = handlerMessagesList(messagesList);
    return (
      <Suspense>
        <MessagesList results={resultsByDate} />
      </Suspense>
    );
  } else {
    return <DefaultMessagesPage />;
  }
};
