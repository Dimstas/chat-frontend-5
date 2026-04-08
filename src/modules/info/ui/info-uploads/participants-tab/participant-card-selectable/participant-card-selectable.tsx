'use client';

import { ContactCard } from 'modules/conversation/contacts/entity';
import { Participant } from 'modules/info/entity/info.entity';
import { useInfoStore } from 'modules/info/model/info.store';
import { JSX } from 'react';

export const ParticipantCardSelectable = (participant: Participant): JSX.Element => {
  const isSelectionMode = useInfoStore((s) => s.isAddMembersMode);
  const selectedIds = useInfoStore((s) => s.selectedIds);
  const toggleSelection = useInfoStore((s) => s.toggleSelection);

  const isSelected = selectedIds.has(participant.uid);
  const { uid, firstName, lastName, avatarUrl, wasOnlineAt, isOnline } = participant;

  return (
    <ContactCard
      selectionMode={isSelectionMode}
      selected={isSelected}
      onSelectHandler={() => toggleSelection(participant.uid)}
      contact={{
        uid,
        phone: '',
        nickname: '',
        firstName,
        lastName,
        fullName: `${firstName} ${lastName}`,
        avatarUrl,
        isOnline,
        wasOnlineAt: wasOnlineAt ?? 0,
      }}
    />
  );
};
