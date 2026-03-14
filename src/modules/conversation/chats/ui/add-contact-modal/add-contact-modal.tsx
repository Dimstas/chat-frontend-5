import { JSX } from 'react';
import { Modal } from 'shared/ui';
import { useChatsStore } from '../../model/search';
import { useChatsScreen } from '../../screens/use-chats-screen';
import AddIcon from './icons/add.svg';

export const AddContactModal = (): JSX.Element | null => {
  const { chats } = useChatsScreen();
  const { selected, isAddModalOpen, closeAddModal } = useChatsStore();

  const chat = chats.find((c) => c.chat.id === selected);
  const { firstName = '', lastName = '' } = chat?.peer ?? {};

  if (!isAddModalOpen) return null;

  return (
    <Modal
      icon={<AddIcon />}
      title={`${firstName} ${lastName}`}
      content="теперь в списке ваших контактов"
      onClose={closeAddModal}
    />
  );
};
