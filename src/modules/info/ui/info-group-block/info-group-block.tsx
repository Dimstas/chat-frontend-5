import { useGenerateInviteLinkQuery, useGroupOrChanelQuery } from 'modules/info/api/info.query';
import { useInfoStore } from 'modules/info/model/info.store';
import { formatParticipants } from 'modules/info/shared/utils/format';
import { JSX, useEffect } from 'react';
import { DropdownItem } from 'shared/ui/dropdown/dropdown.props';
import ClearIcon from '../../shared/icons/clear.svg';
import LeaveIcon from '../../shared/icons/leave.svg';
import { ClearChatModal } from '../clear-chat-modal';
import { InfoAvatar } from '../info-avatar';
import { InfoHeader } from '../info-header';
import { InfoLayout } from '../info-layout';
import { InfoNotification } from '../info-notification';
import { InfoSummary } from '../info-summary';
import { InfoUploads } from '../info-uploads';
import { GROUP_TABS } from '../info-uploads/info-uploads.constants';
import { InfoGroupBlockProps } from './info-group-block.props';

export const InfoGroupBlock = ({ uid, wsUrl, currentUid, chatKey }: InfoGroupBlockProps): JSX.Element => {
  const { openClearModal } = useInfoStore();
  const { data: profile, isLoading } = useGroupOrChanelQuery(chatKey);
  const { mutate: generateLink, data } = useGenerateInviteLinkQuery(chatKey);

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
