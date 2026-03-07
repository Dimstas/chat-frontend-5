'use client';
import { JSX, useState } from 'react';
import { useWebSocketChat } from '../../api/web-socket/use-web-socket-chat';
import { useMessagesListScreen } from '../../screens';
import { useUserIdStore } from '../../zustand-store/zustand-store';
import { MessageInput } from '../message-input/message-input';
import styles from './header-bottom.module.scss';
import ClipIcon from './icon/clip.svg';
import MicIcon from './icon/mic.svg';
import Submit from './icon/submit.svg';

export const HeaderBottom = ({ wsUrl }: { wsUrl: string }): JSX.Element => {
  const [textInput, setTextInput] = useState<string>('');
  const userIdStore = useUserIdStore((s) => s.userId);

  const { sendMessage } = useWebSocketChat(wsUrl);

  const handleSubmitForm = (form: React.FormEvent<HTMLFormElement>): void => {
    form.preventDefault();
    sendMessage(textInput);
    setTextInput('');
  };
  const { status } = useMessagesListScreen(userIdStore);

  return (
    <form className={styles.wrapper} onSubmit={handleSubmitForm}>
      <span className={styles.clipIcon}>
        <ClipIcon />
      </span>
      <MessageInput textInput={textInput} setTextInput={setTextInput} />
      <span className={styles.micIcon}>
        {textInput ? (
          <button type="submit">
            <Submit />
          </button>
        ) : (
          <MicIcon />
        )}
      </span>
    </form>
  );
};
