'use client';
import type { ChatResult } from 'modules/conversation/messages-chat/lib/definitions';
import { getMessageTime } from 'modules/conversation/messages-chat/lib/get-message-time';
import { JSX, MouseEvent, useState } from 'react';
import { ContextMenu } from '../../context-menu/context-menu';
import MessageVector from '../icons/message-vector.svg';
import styles from './outgoing-message-card.module.scss';

export const OutgoingMessagesCard = ({ message }: { message: ChatResult }): JSX.Element => {
  const [contextMenuPos, setContextMenuPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [contextMenuVisible, setContextMenuVisible] = useState<boolean>(false);

  const handleContextMenu = (event: MouseEvent<HTMLDivElement>): void => {
    event.preventDefault(); // Предотвращает стандартное контекстное меню
    setContextMenuPos({ x: event.pageX, y: event.pageY });
    setContextMenuVisible(true);
  };

  const handleCloseMenu = (): void => {
    setContextMenuVisible(false);
  };
  return (
    <div className={styles.wrapper} onContextMenu={handleContextMenu}>
      <ContextMenu position={contextMenuPos} visible={contextMenuVisible} onClose={handleCloseMenu} />
      <div className={styles.item}>
        <div className={styles.message}>
          <span className={styles.messageText}> {message.content} </span>
          <div className={styles.messageSentTime}>
            <div className={styles.messageTime}> {getMessageTime(message.created_at)} </div>
            <div className={styles.messageChatIcons}>
              <MessageVector />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
