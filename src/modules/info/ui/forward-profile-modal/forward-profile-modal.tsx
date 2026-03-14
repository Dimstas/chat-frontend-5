import { useInfoStore } from 'modules/info/model/info.store';
import { JSX } from 'react';
import { SelectChatModal } from 'shared/ui/select-chat-modal/select-chat-modal';

export const FrowardProfileModal = (): JSX.Element | null => {
  const { isForwardModalOpen, closeForwardModal } = useInfoStore();

  const handleForward = (): void => {};

  if (!isForwardModalOpen) return null;

  return <SelectChatModal title="Отправить" onClose={closeForwardModal} onSelect={handleForward} />;
};
