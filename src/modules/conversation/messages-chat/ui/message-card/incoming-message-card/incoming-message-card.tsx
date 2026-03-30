'use client';
import { useAlert } from 'modules/conversation/messages-chat/hooks/use-alert';
import { getMessageTime } from 'modules/conversation/messages-chat/lib/get-message-time';
import { JSX, MouseEvent, useState } from 'react';
import { ContextMenu } from '../../context-menu/context-menu';
import { ReplyCard } from '../reply-card/reply-card';
import styles from './incoming-message-card.module.scss';
import type { IncomingMessageCardProps } from './incoming-message.props';

export const IncomingMessagesCard = ({
  message,
  register,
  sendDeleteMessage,
}: IncomingMessageCardProps): JSX.Element => {
  const [contextMenuPos, setContextMenuPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [contextMenuVisible, setContextMenuVisible] = useState<boolean>(false);

  const handleContextMenu = (event: MouseEvent<HTMLDivElement>): void => {
    event.preventDefault();
    const menuWidth = 250;
    const menuHeight = 220;
    const x = event.pageX;
    const y = event.pageY;
    const adjustedX = x + 5;
    const adjustedY = y - menuHeight - 5;
    const constrainedX =
      adjustedX + menuWidth > window.innerWidth - window.innerWidth / 3.77 ? x - menuWidth - 5 : adjustedX;
    const constrainedY = adjustedY < 150 ? y + 5 : adjustedY;
    setContextMenuPos({ x: constrainedX, y: constrainedY });
    setContextMenuVisible(true);
  };

  const handleCloseMenu = (): void => {
    setContextMenuVisible(false);
  };

  const { confirm } = useAlert();

  const handleDeleteClick = async (): Promise<void> => {
    const ok = await confirm({
      title: 'Удалить сообщение',
      message: 'Вы действительно хотите удалить сообщение?',
      showCheckBox: false,
    });

    if (ok) {
      // вызываем переданный обработчик удаления
      sendDeleteMessage(message);
    } else {
      // отмена — ничего не делаем
    }
  };
  const handleForwardClick = async (): Promise<void> => {
    const ok = await confirm({
      isMessageForwarding: true,
    });
    if (ok) {
      //sendDeleteMessage(message, forAllDeleteRef.current);
    }
  };

  return (
    <div
      className={styles.wrapper}
      onContextMenu={handleContextMenu}
      onMouseLeave={handleCloseMenu}
      ref={(el) => {
        register(el, message);
      }}
    >
      <ContextMenu
        position={contextMenuPos}
        visible={contextMenuVisible}
        onClose={handleCloseMenu}
        handleDeleteClick={handleDeleteClick}
        handleForwardClick={handleForwardClick}
        message={message}
      />
      <div className={styles.item}>
        {message.replied_messages.length > 0 && <ReplyCard repliedMessageStore={message} isIncomingMessage={true} />}
        <div className={styles.message}>
          <span className={styles.messageText}> {message.content} </span>
          <div className={styles.messageSentTime}>
            <div className={styles.messageTime}> {getMessageTime(message.created_at)} </div>
          </div>
        </div>
      </div>
    </div>
  );
};
