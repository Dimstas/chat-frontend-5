import { useGenerateInviteLinkQuery, useGroupOrChanelQuery } from 'modules/info/api/info.query';
import { formatSubscribers } from 'modules/info/shared/utils/format';
import { ClearChatModal } from 'modules/info/ui/clear-chat-modal';
import { DeleteGroupModal } from 'modules/info/ui/delete-group-modal';
import { DeleteMemberModal } from 'modules/info/ui/delete-member-modal';
import { InfoAvatar } from 'modules/info/ui/info-avatar';
import { InfoNotification } from 'modules/info/ui/info-notification';
import { InfoSummary } from 'modules/info/ui/info-summary';
import { InfoUploads } from 'modules/info/ui/info-uploads';
import { CHANNEL_TABS } from 'modules/info/ui/info-uploads/info-uploads.constants';
import { LeaveGroupModal } from 'modules/info/ui/leave-group-modal';
import { JSX } from 'react';

export const ChannelPanel = ({
  uid,
  currentUid,
  wsUrl,
}: {
  uid: string;
  currentUid: string;
  wsUrl: string;
}): JSX.Element => {
  const { data: link } = useGenerateInviteLinkQuery(uid, {
    expires_in: 86400,
  });
  const { data: profile, isLoading } = useGroupOrChanelQuery(uid);

  const name = profile?.name ?? '';
  const membersCount = profile?.participants.length ?? 0;
  const status = formatSubscribers(membersCount);

  return (
    <>
      {isLoading ? (
        <div>Загрузка...</div>
      ) : (
        <>
          <InfoAvatar
            avatarHref={profile?.avatar ?? '/images/profile/group-default.png'}
            label={name}
            status={status}
          />
          <InfoNotification chatId={profile?.id} />
          {profile?.description && <InfoSummary description={profile?.description} />}
          <InfoSummary inviteLinkChannel={link?.invite_link} chatKey={uid} />
          <InfoUploads uid={uid} tabs={CHANNEL_TABS} chatKey={uid} currentUid={currentUid} />
          <ClearChatModal />
          <DeleteMemberModal wsUrl={wsUrl} chatKey={uid} currentUid={currentUid} />
          <LeaveGroupModal wsUrl={wsUrl} chatKey={uid} currentUid={currentUid} name={name} />
          <DeleteGroupModal wsUrl={wsUrl} chatKey={uid} currentUid={currentUid} name={name} />
        </>
      )}
    </>
  );
};
