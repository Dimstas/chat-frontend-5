'use client';
import { JSX, useEffect, useRef, useState } from 'react';
import { useWebSocketChat } from '../../api/web-socket/use-web-socket-chat';
import {
  useForwardMessageStore,
  useRepliedMessageStore,
  useSelectedMessagesStore,
  useSelectedUidUserForForwardMessageStore,
} from '../../zustand-store/zustand-store';
import { ChooseMessagesCard } from '../message-card/choose-messages-card/choose-messages-card';
import { ForwardMessageCard } from '../message-card/forward-message-card/forward-message-card';
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

  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  const { sendMessage } = useWebSocketChat(wsUrl, currentUserId);

  useEffect(() => {
    if (repliedMessageStore || forwardMessageStore) {
      inputRef.current?.focus();
    }
  }, [repliedMessageStore, forwardMessageStore]);

  const handleSubmitForm = (form: React.FormEvent<HTMLFormElement>): void => {
    form.preventDefault();
    sendMessage(textInput, repliedMessageStore);
    if (forwardMessageStore) {
      sendMessage(forwardMessageStore?.content ?? '', repliedMessageStore, forwardMessageStore);
    }
    clearForwardMessageStore();
    clearSelectedUidUserForForwardMessageStore();
    setTextInput('');
    clearRepliedMessageStore();
  };
  const checkBoxsVisibleStore = useSelectedMessagesStore((s) => s.checkBoxsVisible);
  const setcheckBoxsVisibleStore = useSelectedMessagesStore((s) => s.setCheckBoxsVisible);

  return (
    <div className={styles.block}>
      {checkBoxsVisibleStore ? (
        <ChooseMessagesCard setcheckBoxsVisibleStore={setcheckBoxsVisibleStore} />
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
