'use client';
import { JSX, useEffect, useRef, useState } from 'react';
import { useWebSocketChat } from '../../api/web-socket/use-web-socket-chat';
import { useRepliedMessageStore } from '../../zustand-store/zustand-store';
import { ReplyToMessageCard } from '../message-card/reply-to-message-card/reply-to-message-card';
import { MessageInput } from '../message-input/message-input';
import styles from './header-bottom.module.scss';
import ClipIcon from './icon/clip.svg';
import MicIcon from './icon/mic.svg';
import Submit from './icon/submit.svg';

export const HeaderBottom = ({ wsUrl, currentUserId }: { wsUrl: string; currentUserId: string }): JSX.Element => {
  const [textInput, setTextInput] = useState<string>('');
  const repliedMessageStore = useRepliedMessageStore((s) => s.repliedMessage);

  const { content, from_user } = repliedMessageStore ?? {};
  const { first_name, last_name } = from_user ?? {};

  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  const { sendMessage } = useWebSocketChat(wsUrl, currentUserId);

  useEffect(() => {
    if (repliedMessageStore) {
      inputRef.current?.focus();
    }
  }, [repliedMessageStore]);

  const handleSubmitForm = (form: React.FormEvent<HTMLFormElement>): void => {
    form.preventDefault();
    if (repliedMessageStore) {
      sendMessage(textInput, repliedMessageStore);
      setTextInput('');
    }
  };

  return (
    <>
      {repliedMessageStore && (
        <ReplyToMessageCard first_name={first_name ?? ''} last_name={last_name ?? ''} content={content ?? ''} />
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
  );
};
