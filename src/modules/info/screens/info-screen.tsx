'use client';

import { JSX, useEffect } from 'react';
import { DropdownItem } from 'shared/ui/dropdown/dropdown.props';
import { useInfoProfileQuery } from '../api';
import { useInfoStore } from '../model/info.store';
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
    isAddMembersMode,
    exitSelectionMode,
    toggleInfoOpen,
    selectedIds,
  } = useInfoStore();
  const { data: profile, isLoading } = useInfoProfileQuery(uid);

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
      label: 'Покинуть чат',
      icon: <LeaveIcon />,
      onClick: (): void => {},
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

  const renderWithLayout = (header: JSX.Element, content: JSX.Element, footer?: JSX.Element): JSX.Element => (
    <>
      <InfoLayout header={header} footer={footer}>
        {content}
      </InfoLayout>
    </>
  );

  if (isGroup) {
    return renderWithLayout(
      isAddMembersMode ? (
        <InfoHeader title="Пригласить участников" onBack={exitSelectionMode} />
      ) : (
        <InfoHeader menuItems={groupMenuItems} title="Информация о группе" onClose={toggleInfoOpen} />
      ),
      isAddMembersMode ? <AddMemberPanel /> : <GroupPanel uid={uid} currentUid={currentUid} />,
      isAddMembersMode ? (
        <AddMembersButton label="Добавить в группу" onClick={() => {}} disabled={selectedIds.size === 0} />
      ) : undefined,
    );
  }

  return renderWithLayout(
    <InfoHeader menuItems={contactMenuItems} onClose={toggleInfoOpen} />,
    <ContactPanel uid={uid} profile={profile} isLoading={isLoading} currentUid={currentUid} wsUrl={wsUrl} />,
  );
};
