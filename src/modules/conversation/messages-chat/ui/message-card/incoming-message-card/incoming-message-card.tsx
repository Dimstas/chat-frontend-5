'use client';
import { useAlert } from 'modules/conversation/messages-chat/hooks/use-alert';
import { getMessageTime } from 'modules/conversation/messages-chat/lib/get-message-time';
import {
  useForwardMessageStore,
  useRepliedMessageStore,
  useSelectedMessagesStore,
  useSelectedUidUserForForwardMessageStore,
} from 'modules/conversation/messages-chat/zustand-store/zustand-store';
import { useRouter } from 'next/navigation';
import { JSX, MouseEvent, useEffect, useRef, useState } from 'react';
import { ContextMenu } from '../../context-menu/context-menu';
import { ForvardCard } from '../forward-card/forward-card';
import { MessageCheckBox } from '../message-checkbox/message-checkbox';
import { ReplyCard } from '../reply-card/reply-card';
import styles from './incoming-message-card.module.scss';
import type { IncomingMessageCardProps } from './incoming-message.props';

export const IncomingMessagesCard = ({
  message,
  register,
  sendDeleteMessage,
  setToastVisible,
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
  const selectedUidUserForForwardMessageStore = useSelectedUidUserForForwardMessageStore(
    (s) => s.selectedUidUserForForwardMessage,
  );
  const selectedUidUserForForwardMessageRef = useRef<string>(selectedUidUserForForwardMessageStore);

  useEffect(() => {
    selectedUidUserForForwardMessageRef.current = selectedUidUserForForwardMessageStore;
  }, [selectedUidUserForForwardMessageStore, selectedUidUserForForwardMessageRef]);

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
  const setForwardMessageStore = useForwardMessageStore((s) => s.setForwardMessage);
  const clearRepliedMessageStore = useRepliedMessageStore((s) => s.clearRepliedMessage);
  const router = useRouter();

  const handleForwardClick = async (): Promise<void> => {
    const ok = await confirm({
      isMessageForwarding: true,
    });
    if (ok && selectedUidUserForForwardMessageRef.current) {
      setForwardMessageStore(message);
      clearRepliedMessageStore();
      router.push(`/chats/${selectedUidUserForForwardMessageRef.current}`);
    }
  };
  // выясняем является ли "message" в массиве выбранных сообщений ("selectedMessagesStore")
  const selectedMessagesStore = useSelectedMessagesStore((s) => s.selectedMessages);
  const addSelectedMessagesStore = useSelectedMessagesStore((s) => s.addSelectedMessages);
  const deleteSelectedMessagesStore = useSelectedMessagesStore((s) => s.deleteSelectedMessages);
  const [selected, setSelected] = useState<boolean>(true);

  const has = selectedMessagesStore?.some((selectedMessage) => selectedMessage.uid === message.uid);

  const handleCheckBoxClick = (): void => {
    setSelected(!selected);
    if (selected) {
      console.log(selected);
      addSelectedMessagesStore(message);
    } else {
      deleteSelectedMessagesStore(message);
    }
  };
  // показывать компоненты <MessageCheckBox/> в DOM либо нет
  const checkBoxsVisibleStore = useSelectedMessagesStore((s) => s.checkBoxsVisible);

  return (
    <div className={checkBoxsVisibleStore && has ? styles.blockSelected : styles.block}>
      {checkBoxsVisibleStore && (
        <MessageCheckBox message={message} selected={has} handleCheckBoxClick={handleCheckBoxClick} />
      )}
      <div
        className={styles.wrapper}
        onContextMenu={!checkBoxsVisibleStore ? handleContextMenu : (): void => {}}
        onMouseLeave={handleCloseMenu}
        ref={(el) => {
          register(el, message);
        }}
        onClick={handleCheckBoxClick}
      >
        <ContextMenu
          position={contextMenuPos}
          visible={contextMenuVisible}
          onClose={handleCloseMenu}
          handleDeleteClick={handleDeleteClick}
          handleForwardClick={handleForwardClick}
          setToastVisible={setToastVisible}
          message={message}
        />
        <div className={styles.item}>
          {message.replied_messages.length > 0 && <ReplyCard message={message} isIncomingMessage={true} />}
          {message.forwarded_messages.length > 0 && <ForvardCard message={message} />}
          <div className={styles.message}>
            <span className={styles.messageText}> {message.content} </span>
            <div className={styles.messageSentTime}>
              <div className={styles.messageTime}> {getMessageTime(message.created_at)} </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
