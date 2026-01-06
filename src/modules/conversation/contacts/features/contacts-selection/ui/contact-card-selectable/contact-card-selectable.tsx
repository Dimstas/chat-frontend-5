import { Contact } from 'modules/conversation/contacts/entity';
import { ContactCard } from 'modules/conversation/contacts/entity/ui/contact-card';
import { useContactsSelectionStore } from 'modules/conversation/contacts/features/contacts-selection/model';
import { JSX } from 'react';

export const ContactCardSelectable = ({ uid, avatar, wasOnlineAt, fullName }: Contact): JSX.Element => {
  const { isSelectionMode, selectedIds, toggleSelection } = useContactsSelectionStore();

  const isSelected = selectedIds.has(uid);
  return (
    <ContactCard
      contact={{ uid, avatar, wasOnlineAt, fullName }}
      selectionMode={isSelectionMode}
      selected={isSelected}
      onSelectHandler={() => toggleSelection(uid)}
    />
  );
};
