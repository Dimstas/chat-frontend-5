'use client';
import { getMessageTime } from 'modules/conversation/messages-chat/lib/get-message-time';
import { JSX, MouseEvent, useState } from 'react';
import type { RestMessageApi } from '../../../model/messages-list';
import { ContextMenu } from '../../context-menu/context-menu';
import CheckOneIcon from '../icons/check-one.svg';
// import CheckTwoIcon from '../icons/check-two.svg';
import WatchIcon from '../icons/watch.svg';
import styles from './outgoing-message-card.module.scss';

export const OutgoingMessagesCard = ({
  message,
}: {
  message: RestMessageApi & { status?: 'pending' | 'sent' | 'failed' };
}): JSX.Element => {
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
  return (
    <div className={styles.wrapper} onContextMenu={handleContextMenu} onMouseLeave={handleCloseMenu}>
      <ContextMenu position={contextMenuPos} visible={contextMenuVisible} onClose={handleCloseMenu} />
      <div className={styles.item}>
        <div className={styles.message}>
          <span className={styles.messageText}> {message.content} </span>
          <div className={styles.messageSentTime}>
            <div className={styles.messageTime}> {getMessageTime(message.created_at)} </div>
            <div className={styles.messageChatIcons}>
              {message.status === 'sent' && <CheckOneIcon />}
              {(message.status === 'pending' || message.status === 'failed') && <WatchIcon />}
              {/* {message.status === 'failed' && <CheckTwoIcon />} */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
