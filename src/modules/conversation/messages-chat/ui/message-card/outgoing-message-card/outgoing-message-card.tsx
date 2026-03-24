'use client';
import { useAlert } from 'modules/conversation/messages-chat/hooks/use-alert';
import { getMessageTime } from 'modules/conversation/messages-chat/lib/get-message-time';
import { useForAllDeleteStore } from 'modules/conversation/messages-chat/zustand-store/zustand-store';
import { JSX, MouseEvent, useEffect, useRef, useState } from 'react';
import type { RestMessageApi } from '../../../model/messages-list';
import { ContextMenu } from '../../context-menu/context-menu';
import CheckOneIcon from '../icons/check-one.svg';
import CheckTwoIcon from '../icons/check-two.svg';
import WatchIcon from '../icons/watch.svg';
import { ReplyToMessageCard } from '../reply-to-message-card/reply-to-message-card';
import styles from './outgoing-message-card.module.scss';

export const OutgoingMessagesCard = ({
  message,
  sendDeleteMessage,
}: {
  message: RestMessageApi & { status?: 'pending' | 'sent' | 'failed' | 'read' };
  sendDeleteMessage: (
    message: RestMessageApi & { status?: 'pending' | 'sent' | 'failed' | 'read' },
    selected?: boolean,
  ) => void;
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

  const { confirm } = useAlert();
  const forAllDeleteStore = useForAllDeleteStore((s) => s.forAllDelete);
  const forAllDeleteRef = useRef<boolean>(forAllDeleteStore);
  useEffect(() => {
    forAllDeleteRef.current = forAllDeleteStore;
  }, [forAllDeleteRef, forAllDeleteStore]);

  const handleDeleteClick = async (): Promise<void> => {
    const ok = await confirm({
      title: 'Удалить сообщение',
      message: 'Вы действительно хотите удалить сообщение?',
      showCheckBox: true,
      labelCheckBox: `Удалить у меня и у ${message.to_user.first_name}`,
    });
    if (ok && forAllDeleteRef.current !== null) {
      sendDeleteMessage(message, forAllDeleteRef.current);
    }
  };

  return (
    <div className={styles.wrapper} onContextMenu={handleContextMenu} onMouseLeave={handleCloseMenu}>
      <ContextMenu
        position={contextMenuPos}
        visible={contextMenuVisible}
        onClose={handleCloseMenu}
        handleDeleteClick={handleDeleteClick}
        message={message}
      />
      <div className={styles.item}>
        {message.replied_messages.length > 0 && (
          <ReplyToMessageCard
            first_name={message.replied_messages[0].first_name}
            last_name={message.replied_messages[0].last_name}
            content={message.replied_messages[0].content ?? ''}
          />
        )}
        <div className={styles.message}>
          <span className={styles.messageText}> {message.content} </span>
          <div className={styles.messageSentTime}>
            <div className={styles.messageTime}> {getMessageTime(message.created_at)} </div>
            <div className={styles.messageChatIcons}>
              {message.status === 'sent' && message.new === true && <CheckOneIcon />}
              {(message.status === 'pending' || message.status === 'failed') && <WatchIcon />}
              {message.new === false && <CheckTwoIcon />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
