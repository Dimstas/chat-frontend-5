'use client';

import { useAlert } from 'modules/conversation/messages-chat/hooks/use-alert';
import { useDownloadMessageFile } from 'modules/conversation/messages-chat/hooks/use-download-message-file';
import { getMessageTime } from 'modules/conversation/messages-chat/lib/get-message-time';
import {
  useForAllDeleteStore,
  useForwardMessageStore,
  useRepliedMessageStore,
  useSelectedMessagesStore,
  useSelectedUidUserForForwardMessageStore,
} from 'modules/conversation/messages-chat/zustand-store/zustand-store';
import { useRouter } from 'next/navigation';
import { JSX, MouseEvent, useEffect, useRef, useState } from 'react';
import { ContextMenu } from '../../../context-menu/context-menu';
import { HighlightedFileName } from '../../file-card/highlighted-file-name/highlighted-file-name';
import DeleteFileIcon from '../../file-card/icons/delete-file-icon.svg';
import { ForvardCard } from '../../forward-card/forward-card';
import CheckOneIcon from '../../icons/check-one.svg';
import CheckTwoIcon from '../../icons/check-two.svg';
import WatchIcon from '../../icons/watch.svg';
import { MessageCheckBox } from '../../message-checkbox/message-checkbox';
import { ReplyCard } from '../../reply-card/reply-card';
import AudioPlayIcon from '../icon/audio-play.svg';
import styles from './outgoing-audio-card.module.scss';
import { OutgoingAudioCardProps } from './outgoing-audio-card.props';

export const OutgoingAudioCard = ({
  message,
  sendDeleteMessage,
  search,
  isHighlighted,
  currentUserId,
}: OutgoingAudioCardProps): JSX.Element => {
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
  const selectedUidUserForForwardMessageStore = useSelectedUidUserForForwardMessageStore(
    (s) => s.selectedUidUserForForwardMessage,
  );
  const selectedUidUserForForwardMessageRef = useRef<string>(selectedUidUserForForwardMessageStore);
  const clearSelectedMessagesStore = useSelectedMessagesStore((s) => s.clearSelectedMessages);
  useEffect(() => {
    forAllDeleteRef.current = forAllDeleteStore;
    selectedUidUserForForwardMessageRef.current = selectedUidUserForForwardMessageStore;
  }, [forAllDeleteRef, forAllDeleteStore, selectedUidUserForForwardMessageStore, selectedUidUserForForwardMessageRef]);

  const handleDeleteClick = async (): Promise<void> => {
    const ok = await confirm({
      title: 'Удалить сообщение',
      message: 'Вы действительно хотите удалить сообщение?',
      showCheckBox: true,
      labelCheckBox: `Удалить у меня и у ${message.to_user?.first_name !== '' ? message.to_user?.first_name : message.to_user?.nickname}`,
    });
    if (ok && forAllDeleteRef.current !== null) {
      sendDeleteMessage(message, forAllDeleteRef.current);
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
      clearSelectedMessagesStore();
      router.push(`/chats/${selectedUidUserForForwardMessageRef.current}`);
    }
  };
  // выясняем имеется ли "message" в массиве выбранных сообщений ("selectedMessagesStore")
  const selectedMessagesStore = useSelectedMessagesStore((s) => s.selectedMessages);
  const addSelectedMessagesStore = useSelectedMessagesStore((s) => s.addSelectedMessages);
  const deleteSelectedMessagesStore = useSelectedMessagesStore((s) => s.deleteSelectedMessages);

  const [selected, setSelected] = useState<boolean>(true);
  const has = selectedMessagesStore?.some((selectedMessage) => selectedMessage.uid === message.uid);

  const handleCheckBoxClick = (): void => {
    setSelected(!selected);
    if (selected) {
      addSelectedMessagesStore(message);
    } else {
      deleteSelectedMessagesStore(message);
    }
  };
  // показывать компоненты <MessageCheckBox/> в DOM либо нет
  const checkBoxsVisibleStore = useSelectedMessagesStore((s) => s.checkBoxsVisible);

  // мгновенно скрывает в DOM карточку файла, отправку которого отменил пользователь
  const [isDeletedFile, setIsDeletedFile] = useState<boolean>(false);
  const handleDeleteFileClick = (): void => {
    setIsDeletedFile(true);
  };
  //эффект для удаления незагруженного файла (который имеет статус 'pending' либо 'failed' )
  useEffect(() => {
    if (isDeletedFile && message.status === 'sent') {
      sendDeleteMessage(message, true);
    }
  }, [message]);
  //хук для загрузки файла находящегося в сообщении
  const { handleDownloadMessageFileClick, handleStopDownloadMessageFileClick, isDownloading } =
    useDownloadMessageFile(message);

  return (
    <div className={(checkBoxsVisibleStore && has) || isHighlighted ? styles.blockSelected : styles.block}>
      {checkBoxsVisibleStore && (
        <MessageCheckBox message={message} selected={has} handleCheckBoxClick={handleCheckBoxClick} />
      )}
      <div
        className={styles.wrapper}
        onContextMenu={!checkBoxsVisibleStore ? handleContextMenu : (): void => {}}
        onMouseLeave={handleCloseMenu}
      >
        <ContextMenu
          position={contextMenuPos}
          visible={contextMenuVisible}
          onClose={handleCloseMenu}
          handleDeleteClick={handleDeleteClick}
          handleForwardClick={handleForwardClick}
          message={message}
        />
        {!isDeletedFile && (
          <div className={styles.item}>
            {message.replied_messages.length > 0 && <ReplyCard message={message} isIncomingMessage={false} />}
            {message.forwarded_messages.length > 0 && <ForvardCard message={message} currentUserId={currentUserId} />}
            <div className={styles.contentBlock}>
              <div className={styles.fileIcon}>
                {message.status === 'pending' || message.status === 'failed' ? (
                  <button onClick={handleDeleteFileClick} className={styles.deleteFileIcon}>
                    <DeleteFileIcon />
                  </button>
                ) : isDownloading ? (
                  <button onClick={handleStopDownloadMessageFileClick} className={styles.deleteFileIcon}>
                    <DeleteFileIcon />
                  </button>
                ) : (
                  <button onClick={handleDownloadMessageFileClick} className={styles.fileIcon}>
                    <AudioPlayIcon />
                  </button>
                )}
              </div>
              <div className={styles.fileInfo}>
                <div className={styles.fileName}>
                  <HighlightedFileName
                    fileName={
                      message.files_list.length
                        ? message.files_list[0].download_name
                        : message.forwarded_messages[0].files_list[0].download_name
                    }
                    search={search}
                  />
                </div>
                <div className={styles.fileSizeAndMessageTimeBlock}>
                  <div className={styles.fileSize}>0:12</div>
                  <div className={styles.messageTimeAndChatIcons}>
                    <div className={styles.messageTime}>{getMessageTime(message.created_at)}</div>
                    <div className={styles.messageChatIcons}>
                      {message.status === 'sent' && message.new === true && <CheckOneIcon />}
                      {(message.status === 'pending' || message.status === 'failed') && <WatchIcon />}
                      {message.new === false && <CheckTwoIcon />}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
