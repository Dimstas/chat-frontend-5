'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useWebSocketChat } from 'modules/conversation/messages-chat/api/web-socket/use-web-socket-chat';
import { JSX, useEffect } from 'react';
import { DropdownItem } from 'shared/ui/dropdown/dropdown.props';
import { useInfoProfileQuery } from '../api';
import { useInfoSearchStore } from '../model/info.search.store';
import { useInfoStore } from '../model/info.store';
import { AddOrRemoveMembersRequestAPI } from '../model/info.web-socket.api.schema';
import BlockIcon from '../shared/icons/block.svg';
import ClearIcon from '../shared/icons/clear.svg';
import ForwardIcon from '../shared/icons/forward.svg';
import LeaveIcon from '../shared/icons/leave.svg';
import { AddMembersButton } from '../ui/add-members-button';
import { InfoHeader } from '../ui/info-header';
import { InfoLayout } from '../ui/info-layout';
import { AddMemberPanel } from '../widgets/add-member-panel';
import { ContactPanel } from '../widgets/contact-panel';
import { GroupPanel } from '../widgets/group-panel';
import { InfoScreenProps } from './info-screen.props';

export const InfoScreen = ({ uid, wsUrl, currentUid }: InfoScreenProps): JSX.Element => {
  const {
    openClearModal,
    setUid,
    openBlockModal,
    openForwardModal,
    openLeaveGroupModal,
    isAddMembersMode,
    exitSelectionMode,
    toggleInfoOpen,
    selectedIds,
    clearSelection,
  } = useInfoStore();
  const { clearQuery } = useInfoSearchStore();
  const { sendMembers } = useWebSocketChat(wsUrl, currentUid);
  const { data: profile, isLoading } = useInfoProfileQuery(uid);
  const queryClient = useQueryClient();

  useEffect(() => {
    setUid(uid);
  }, [uid, setUid]);

  const isGroup = uid.startsWith('group');

  const groupMenuItems: DropdownItem[] = [
    {
      label: 'Очистить чат',
      icon: <ClearIcon />,
      onClick: openClearModal,
    },
    {
      label: 'Покинуть группу',
      icon: <LeaveIcon />,
      onClick: openLeaveGroupModal,
    },
  ];

  const contactMenuItems: DropdownItem[] = [
    {
      label: 'Поделиться профилем',
      icon: <ForwardIcon />,
      onClick: openForwardModal,
    },
    {
      label: 'Очистить чат',
      icon: <ClearIcon />,
      onClick: openClearModal,
    },
  ];

  if (!profile?.isBlocked) {
    contactMenuItems.push({
      label: 'Заблокировать',
      icon: <BlockIcon />,
      variant: 'alert',
      onClick: openBlockModal,
    });
  }

  const handleBack = (): void => {
    clearSelection();
    clearQuery();
    exitSelectionMode();
  };

  const handleAddMembers = (): void => {
    if (selectedIds) {
      const requestUid = crypto.randomUUID();
      const payload: AddOrRemoveMembersRequestAPI = {
        action: 'add_members_to_chat',
        request_uid: requestUid,
        object: {
          chat_key: uid,
          uid_users_list: [...selectedIds],
        },
      };
      sendMembers(payload);

      queryClient.refetchQueries({
        queryKey: ['participants', 'participants-list', uid],
      });

      clearSelection();
      clearQuery();
      exitSelectionMode();
    }
  };

  const renderWithLayout = (header: JSX.Element, content: JSX.Element, footer?: JSX.Element): JSX.Element => (
    <>
      <InfoLayout header={header} footer={footer}>
        {content}
      </InfoLayout>
    </>
  );

  if (isGroup) {
    const header = isAddMembersMode ? (
      <InfoHeader title="Пригласить участников" onBack={handleBack} />
    ) : (
      <InfoHeader menuItems={groupMenuItems} title="Информация о группе" onClose={toggleInfoOpen} />
    );
    const content = isAddMembersMode ? (
      <AddMemberPanel chatKey={uid} />
    ) : (
      <GroupPanel uid={uid} currentUid={currentUid} wsUrl={wsUrl} />
    );
    const footer = isAddMembersMode ? (
      <AddMembersButton label="Добавить в группу" onClick={handleAddMembers} disabled={selectedIds.size === 0} />
    ) : undefined;

    return renderWithLayout(header, content, footer);
  }

  return renderWithLayout(
    <InfoHeader menuItems={contactMenuItems} onClose={toggleInfoOpen} />,
    <ContactPanel uid={uid} profile={profile} isLoading={isLoading} currentUid={currentUid} wsUrl={wsUrl} />,
  );
};
