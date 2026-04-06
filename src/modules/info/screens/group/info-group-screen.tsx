'use client';

import { useChatsScreen } from 'modules/conversation/chats/screens/use-chats-screen';
import { useGenerateInviteLinkQuery, useGroupOrChanelQuery } from 'modules/info/api/info.query';
import { useInfoStore } from 'modules/info/model/info.store';
import { formatParticipants } from 'modules/info/shared/utils/format';
import { ClearChatModal } from 'modules/info/ui/clear-chat-modal';
import { InfoAvatar } from 'modules/info/ui/info-avatar';
import { InfoHeader } from 'modules/info/ui/info-header';
import { InfoLayout } from 'modules/info/ui/info-layout';
import { InfoNotification } from 'modules/info/ui/info-notification';
import { InfoSummary } from 'modules/info/ui/info-summary';
import { InfoUploads } from 'modules/info/ui/info-uploads';
import { GROUP_TABS } from 'modules/info/ui/info-uploads/info-uploads.constants';
import { JSX, useEffect } from 'react';
import { DropdownItem } from 'shared/ui/dropdown/dropdown.props';
import ClearIcon from '../../shared/icons/clear.svg';
import LeaveIcon from '../../shared/icons/leave.svg';
import { InfoGroupScreenProps } from './info-group-screen.props';

export const InfoGroupScreen = ({ uid, wsUrl, currentUid }: InfoGroupScreenProps): JSX.Element => {
  const { openClearModal, chatId } = useInfoStore();
  const { chats } = useChatsScreen();
  const chat = chats.find((c) => c.chat.id === chatId);

  const chatKey = chat?.chat.chatKey;
  const { data: profile, isLoading } = useGroupOrChanelQuery(chatKey ?? '');
  const { mutate: generateLink, data } = useGenerateInviteLinkQuery(chat?.chat.chatKey ?? '');

  const name = profile?.name ?? '';
  const membersCount = profile?.participants.length ?? 0;
  const status = formatParticipants(membersCount);

  useEffect(() => {
    generateLink({
      expires_in: 86400,
    });
  }, [generateLink]);

  const menuItems: DropdownItem[] = [
    {
      label: 'Очистить чат',
      icon: <ClearIcon />,
      onClick: openClearModal,
    },
    {
      label: 'Покинуть чат',
      icon: <LeaveIcon />,
      onClick: (): void => {},
    },
  ];

  return (
    <>
      {isLoading ? (
        <div>Загрузка...</div>
      ) : (
        <>
          <InfoLayout header={<InfoHeader menuItems={menuItems} title="Информация о группе" />}>
            <InfoAvatar
              avatarHref={profile?.avatar ?? '/images/profile/group-default.png'}
              label={name}
              status={status}
            />
            <InfoNotification chatId={profile?.id} />
            <InfoSummary description={profile?.description} />
            <InfoSummary inviteLink={data?.invite_link} chatKey={chatKey} />
            <InfoUploads uid={uid} tabs={GROUP_TABS} chatKey={chatKey} currentUid={currentUid} />
          </InfoLayout>
          <ClearChatModal />
        </>
      )}
    </>
  );
};
