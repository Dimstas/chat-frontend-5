import { useHeaderButtonsModalStore } from 'modules/conversation/messages-chat/zustand-store/zustand-store';
import { JSX } from 'react';
import { Modal } from 'shared/ui';
import AddIcon from './icons/add.svg';

export const AddModal = ({ fullName }: { fullName: string }): JSX.Element | null => {
  const { isAddModalOpen, closeAddModal } = useHeaderButtonsModalStore();

  if (!isAddModalOpen) return null;

  return (
    <Modal icon={<AddIcon />} title={fullName} content="теперь в списке ваших контактов" onClose={closeAddModal} />
  );
};
