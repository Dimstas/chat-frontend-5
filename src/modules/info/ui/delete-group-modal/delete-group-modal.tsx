import { useQueryClient } from '@tanstack/react-query';
import { useWebSocketChat } from 'modules/conversation/messages-chat/api/web-socket/use-web-socket-chat';
import { useInfoStore } from 'modules/info/model/info.store';
import { DeleteGroupRequestAPI } from 'modules/info/model/info.web-socket.api.schema';
import { useNotificationStore } from 'modules/notification/model/notification.store';
import { JSX } from 'react';
import { Modal } from 'shared/ui';

type DeleteGroupModalProps = {
  wsUrl: string;
  currentUid: string;
  chatKey: string;
  name: string;
};

export const DeleteGroupModal = ({ wsUrl, currentUid, chatKey, name }: DeleteGroupModalProps): JSX.Element | null => {
  const { isDeleteGroupModalOpen, closeDeleteGroupModal } = useInfoStore();
  const { sendDeleteGroup } = useWebSocketChat(wsUrl, currentUid);
  const { openPopup, setCallback, setTitle, setTimer } = useNotificationStore();
  const queryClient = useQueryClient();

  if (!isDeleteGroupModalOpen) return null;

  const sendAndRefetch = (): void => {
    const requestUid = crypto.randomUUID();
    const payload: DeleteGroupRequestAPI = {
      action: 'delete_chat',
      request_uid: requestUid,
      object: { chat_key: chatKey },
    };
    sendDeleteGroup(payload);
    queryClient.invalidateQueries({ queryKey: ['chats', 'chat-list'] });
  };

  const handleDelete = (): void => {
    setCallback(sendAndRefetch);
    setTitle('Группа удалена');
    setTimer(5000);
    openPopup();

    closeDeleteGroupModal();
  };

  return (
    <Modal
      title={`Удалить группу «${name}»?`}
      content={'Все сообщения в этом чате будут удалены только для вас. Собеседник по-прежнему сможет их видеть'}
      firstButtonText="Отменить"
      secondButtonText="Удалить"
      onFirstButtonClick={closeDeleteGroupModal}
      onSecondButtonClick={handleDelete}
      onClose={closeDeleteGroupModal}
    />
  );
};
