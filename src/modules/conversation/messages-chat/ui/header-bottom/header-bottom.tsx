'use client';
import clsx from 'clsx';
import { JSX, useEffect, useRef, useState } from 'react';
import { useWebSocketChat } from '../../api/web-socket/use-web-socket-chat';
import { useAlert } from '../../hooks/use-alert';
import {
  useAttachmentFilesStore,
  useForwardMessageStore,
  useRepliedMessageStore,
  useSelectedMessagesStore,
  useSelectedUidUserForForwardMessageStore,
  useTextForAttachmentFilesStore,
  useUserIdStore,
} from '../../zustand-store/zustand-store';
import { ContextMenuAttachFile } from '../context-menu/context-menu-attach-file/context-menu-attach-file';
import type { Attachment } from '../context-menu/context-menu-attach-file/context-menu-attach-file.props';
import { ChooseMessagesCard } from '../message-card/choose-messages-card/choose-messages-card';
import { ForwardMessageCard } from '../message-card/forward-message-card/forward-message-card';
import { ForwardMessagesCard } from '../message-card/forward-messages-card/forward-messages-card';
import { ReplyToMessageCard } from '../message-card/reply-to-message-card/reply-to-message-card';
import { MessageInput } from '../message-input/message-input';
import styles from './header-bottom.module.scss';
import type { HeaderBottomProps } from './header-bottom.props';
import ClipIcon from './icon/clip.svg';
import MicIcon from './icon/mic.svg';
import Submit from './icon/submit.svg';

export const HeaderBottom = ({ wsUrl, currentUserId }: HeaderBottomProps): JSX.Element => {
  const [textInput, setTextInput] = useState<string>('');
  const repliedMessageStore = useRepliedMessageStore((s) => s.repliedMessage);
  const clearRepliedMessageStore = useRepliedMessageStore((s) => s.clearRepliedMessage);
  const forwardMessageStore = useForwardMessageStore((s) => s.forwardMessage);
  const clearForwardMessageStore = useForwardMessageStore((s) => s.clearForwardMessage);
  const clearSelectedUidUserForForwardMessageStore = useSelectedUidUserForForwardMessageStore(
    (s) => s.clearSelectedUidUserForForwardMessage,
  );
  const selectedMessagesStore = useSelectedMessagesStore((s) => s.selectedMessages);
  const clearSelectedMessagesStore = useSelectedMessagesStore((s) => s.clearSelectedMessages);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const { sendMessage, sendDeleteMessage } = useWebSocketChat(wsUrl, currentUserId);
  const userIdStore = useUserIdStore((s) => s.userId);
  const attachmentFilesStore = useAttachmentFilesStore((s) => s.attachmentFiles);
  const textForAttachmentFilesStore = useTextForAttachmentFilesStore((s) => s.textForAttachmentFiles);
  const clearAttachmentFilesStore = useAttachmentFilesStore((s) => s.clearAttachmentFiles);
  const clearTextForAttachmentFilesStore = useTextForAttachmentFilesStore((s) => s.clearTextForAttachmentFiles);
  const textForAttachmentFilesRef = useRef<string>(textForAttachmentFilesStore);
  const attachmentFilesRef = useRef<Attachment[]>(attachmentFilesStore);

  useEffect(() => {
    textForAttachmentFilesRef.current = textForAttachmentFilesStore;
    attachmentFilesRef.current = attachmentFilesStore;
  }, [textForAttachmentFilesStore, attachmentFilesStore]);

  useEffect(() => {
    if (repliedMessageStore || forwardMessageStore || selectedMessagesStore?.length || userIdStore) {
      inputRef.current?.focus();
    }
  }, [repliedMessageStore, forwardMessageStore, selectedMessagesStore, userIdStore]);

  const handleSubmitForm = (form: React.FormEvent<HTMLFormElement>): void => {
    form.preventDefault();
    sendMessage({ content: textInput, repliedMessage: repliedMessageStore });
    if (forwardMessageStore) {
      sendMessage({ content: forwardMessageStore?.content ?? '', forwardMessage: forwardMessageStore });
    }
    if (selectedMessagesStore && selectedMessagesStore.length) {
      selectedMessagesStore.forEach((msg) => {
        sendMessage({ content: msg.content ?? '', forwardMessage: msg });
      });
    }
    clearSelectedUidUserForForwardMessageStore();
    if (document.activeElement === inputRef.current) {
      clearRepliedMessageStore();
      clearForwardMessageStore();
      clearSelectedMessagesStore();
      setTextInput('');
    }
    clearAttachmentFilesStore();
    clearTextForAttachmentFilesStore();
  };
  const checkBoxsVisibleStore = useSelectedMessagesStore((s) => s.checkBoxsVisible);
  const setCheckBoxsVisibleStore = useSelectedMessagesStore((s) => s.setCheckBoxsVisible);
  const [contextMenuPos, setContextMenuPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [contextMenuVisible, setContextMenuVisible] = useState<boolean>(false);
  const clipIconButtonRef = useRef<HTMLDivElement | null>(null);

  const handleContextMenu = (): void => {
    if (clipIconButtonRef.current) {
      const { y, x } = clipIconButtonRef.current.getBoundingClientRect();
      const menuHeight = 108;
      const adjustedX = x - 10;
      const adjustedY = y - menuHeight - 10;
      setContextMenuPos({ x: adjustedX, y: adjustedY });
      setContextMenuVisible(true);
      setTextInput('');
    }
  };
  const handleCloseMenu = (): void => {
    setContextMenuVisible(false);
  };
  // блок вызова модального окна с обработчиком для отправки сообщения и вложенных файлов
  const { confirm } = useAlert();
  const handleAttachmentFilesClick = async (): Promise<void> => {
    const ok = await confirm({
      isAttachmentFiles: true,
    });
    if (ok) {
      sendMessage({
        content: textForAttachmentFilesRef.current,
      });
      if (attachmentFilesRef.current && attachmentFilesRef.current.length) {
        attachmentFilesRef.current.forEach((attachmentFile) => {
          sendMessage({
            content: attachmentFile.fileData.filename,
            repliedMessage: repliedMessageStore,
            file: attachmentFile,
          });
        });
      }
      if (forwardMessageStore) {
        sendMessage({ content: forwardMessageStore?.content ?? '', forwardMessage: forwardMessageStore });
      }
      if (selectedMessagesStore) {
        selectedMessagesStore.forEach((msg) => {
          sendMessage({ content: msg.content ?? '', forwardMessage: msg });
        });
      }
      clearForwardMessageStore();
      clearSelectedUidUserForForwardMessageStore();
      clearRepliedMessageStore();
      setTextInput('');
      clearSelectedMessagesStore();
      clearAttachmentFilesStore();
      clearTextForAttachmentFilesStore();
    } else {
      // отмена — ничего не делаем
    }
  };

  return (
    <div className={styles.block}>
      {checkBoxsVisibleStore ? (
        <ChooseMessagesCard
          setCheckBoxsVisibleStore={setCheckBoxsVisibleStore}
          selectedMessagesStore={selectedMessagesStore}
          clearSelectedMessagesStore={clearSelectedMessagesStore}
          sendDeleteMessage={sendDeleteMessage}
        />
      ) : (
        <>
          {repliedMessageStore && (
            <ReplyToMessageCard
              repliedMessageStore={repliedMessageStore}
              clearRepliedMessageStore={clearRepliedMessageStore}
            />
          )}
          {forwardMessageStore && (
            <ForwardMessageCard
              forwardMessageStore={forwardMessageStore}
              clearForwardMessageStore={clearForwardMessageStore}
            />
          )}
          {!!selectedMessagesStore?.length && (
            <ForwardMessagesCard
              selectedMessagesStore={selectedMessagesStore}
              clearSelectedMessagesStore={clearSelectedMessagesStore}
              currentUserId={currentUserId}
            />
          )}
          <form className={styles.wrapper} onSubmit={handleSubmitForm}>
            <div
              className={contextMenuVisible ? clsx(styles.clipIcon, styles.clipIconActive) : styles.clipIcon}
              ref={clipIconButtonRef}
              onClick={handleContextMenu}
            >
              {contextMenuVisible && (
                <ContextMenuAttachFile
                  contextMenuPos={contextMenuPos}
                  handleCloseMenu={handleCloseMenu}
                  handleAttachmentFilesClick={handleAttachmentFilesClick}
                />
              )}
              <ClipIcon />
            </div>
            <MessageInput textInput={textInput} setTextInput={setTextInput} inputRef={inputRef} />
            <span className={styles.micIcon}>
              {textInput ? (
                <button type="submit" style={{ width: '5rem', height: '5rem' }}>
                  <Submit />
                </button>
              ) : (
                <MicIcon />
              )}
            </span>
          </form>
        </>
      )}
    </div>
  );
};
