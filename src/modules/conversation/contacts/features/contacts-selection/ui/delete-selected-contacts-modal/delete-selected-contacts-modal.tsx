'use client';

import { useContactsSelectionStore } from 'modules/conversation/contacts/features/contacts-selection/model';
import { JSX } from 'react';
import { Modal } from 'shared/ui/modal';

export const DeleteSelectedContactsModal = (): JSX.Element | null => {
  const {
    selectedIds,
    clearSelection,
    deleteSelectedContacts,
    isDeleteModalOpen,
    closeDeleteModal,
    exitSelectionMode,
  } = useContactsSelectionStore();

  const count = selectedIds.size;

  if (!isDeleteModalOpen) return null;

  return (
    <Modal
      title="Удалить контакты"
      content={`Вы уверены, что хотите удалить ${count} контакт${count > 1 ? 'а' : ''}?`}
      firstButtonText="Удалить"
      secondButtonText="Отмена"
      onFirstButtonClick={() => {
        deleteSelectedContacts();
        closeDeleteModal();
        clearSelection();
        exitSelectionMode();
      }}
      onSecondButtonClick={closeDeleteModal}
      onClose={closeDeleteModal}
    />
  );
};
