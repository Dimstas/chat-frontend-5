'use client';
import { JSX, useEffect, useRef, useState } from 'react';
import { useWebSocketChat } from '../../api/web-socket/use-web-socket-chat';
import {
  useForwardMessageStore,
  useRepliedMessageStore,
  useSelectedMessagesStore,
  useSelectedUidUserForForwardMessageStore,
  useUserIdStore,
} from '../../zustand-store/zustand-store';
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
  useEffect(() => {
    if (repliedMessageStore || forwardMessageStore || selectedMessagesStore?.length || userIdStore) {
      inputRef.current?.focus();
    }
  }, [repliedMessageStore, forwardMessageStore, selectedMessagesStore, userIdStore]);

  const handleSubmitForm = (form: React.FormEvent<HTMLFormElement>): void => {
    form.preventDefault();
    sendMessage(textInput, repliedMessageStore);
    if (forwardMessageStore) {
      sendMessage(forwardMessageStore?.content ?? '', repliedMessageStore, forwardMessageStore);
    }
    if (selectedMessagesStore && selectedMessagesStore.length) {
      selectedMessagesStore.forEach((m) => {
        sendMessage(m.content ?? '', repliedMessageStore, m);
      });
    }
    clearForwardMessageStore();
    clearSelectedUidUserForForwardMessageStore();
    setTextInput('');
    clearRepliedMessageStore();
    clearSelectedMessagesStore();
  };
  const checkBoxsVisibleStore = useSelectedMessagesStore((s) => s.checkBoxsVisible);
  const setCheckBoxsVisibleStore = useSelectedMessagesStore((s) => s.setCheckBoxsVisible);

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
            <span className={styles.clipIcon}>
              <ClipIcon />
            </span>
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
