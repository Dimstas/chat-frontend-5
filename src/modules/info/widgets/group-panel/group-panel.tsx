import { useGenerateInviteLinkQuery, useGroupOrChanelQuery } from 'modules/info/api/info.query';
import { formatParticipants } from 'modules/info/shared/utils/format';
import { ClearChatModal } from 'modules/info/ui/clear-chat-modal';
import { DeleteGroupModal } from 'modules/info/ui/delete-group-modal';
import { DeleteMemberModal } from 'modules/info/ui/delete-member-modal';
import { InfoAvatar } from 'modules/info/ui/info-avatar';
import { InfoNotification } from 'modules/info/ui/info-notification';
import { InfoSummary } from 'modules/info/ui/info-summary';
import { InfoUploads } from 'modules/info/ui/info-uploads';
import { GROUP_TABS } from 'modules/info/ui/info-uploads/info-uploads.constants';
import { LeaveGroupModal } from 'modules/info/ui/leave-group-modal';
import { JSX, useEffect } from 'react';

export const GroupPanel = ({
  uid,
  currentUid,
  wsUrl,
}: {
  uid: string;
  currentUid: string;
  wsUrl: string;
}): JSX.Element => {
  const { mutate: generateLink, data } = useGenerateInviteLinkQuery(uid);
  const { data: profile, isLoading } = useGroupOrChanelQuery(uid);

  const name = profile?.name ?? '';
  const membersCount = profile?.participants.length ?? 0;
  const status = formatParticipants(membersCount);

  useEffect(() => {
    generateLink({
      expires_in: 86400,
    });
  }, [generateLink]);

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
          <InfoSummary description={profile?.description} />
          <InfoSummary inviteLink={data?.invite_link} chatKey={uid} />
          <InfoUploads uid={uid} tabs={GROUP_TABS} chatKey={uid} currentUid={currentUid} />
          <ClearChatModal />
          <DeleteMemberModal wsUrl={wsUrl} chatKey={uid} currentUid={currentUid} />
          <LeaveGroupModal wsUrl={wsUrl} chatKey={uid} currentUid={currentUid} name={name} />
          <DeleteGroupModal wsUrl={wsUrl} chatKey={uid} currentUid={currentUid} name={name} />
        </>
      )}
    </>
  );
};
