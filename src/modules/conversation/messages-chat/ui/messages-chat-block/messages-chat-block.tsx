import { CONTACTS_LIST } from 'modules/conversation/shared/utils/contact-list';
import { JSX } from 'react';
import { HeaderTop } from '../header-top/header-top';
import { MessageCard } from '../message-card/message-card';
import { MessagesListLayout } from '../messages-list-layout/messages-list-layout';
import { MessageSections } from '../messages-sections/messages-sections';
const { avatar, first_name, last_name, status } = CONTACTS_LIST[0];

export const MessagesChatBlock = (): JSX.Element => {
  return (
    <MessagesListLayout
      headerTop={<HeaderTop avatarHref={avatar} username={first_name} lastname={last_name} was_online_at={status} />}
      headerBottom={null}
    >
      <MessageSections>
        <MessageCard />
      </MessageSections>
    </MessagesListLayout>
  );
};
