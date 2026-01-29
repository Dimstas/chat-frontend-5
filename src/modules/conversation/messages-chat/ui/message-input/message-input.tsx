'use client';
import { JSX, useState } from 'react';
import { ImageUI } from 'shared/ui/image';
import { addRecentEmodji } from '../../utils/recent-emodji-array';
import { EmodjiBlock } from '../emodji-block/emodji-block';
import SmailIcon from './icon/smail.svg';
import VioletSmailIcon from './icon/violet-smail.svg';
import styles from './message-input.module.scss';

export const MessageInput = (): JSX.Element => {
  const [message, setMessage] = useState<string>('');
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
  const [recentEmoji, setRecentEmoji] = useState<string[]>([]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setMessage(event.target.value);
  };
  const handleEmojiSelect = (emoji: string): void => {
    setSelectedEmoji(emoji);
    setShowEmojiPicker(false);
    setRecentEmoji(addRecentEmodji(emoji));
  };
  const toggleEmojiPicker = (): void => {
    setShowEmojiPicker(!showEmojiPicker);
  };
  return (
    <div className={styles.inputWrapper}>
      <form className={styles.form}>
        <input
          id="message"
          name="message"
          value={message}
          placeholder="Сообщение"
          onChange={handleChange}
          className={styles.input}
        />
        {selectedEmoji && (
          <span className={styles.emodji}>
            <ImageUI
              src={`/images/messages-chats/smileysIcons/${selectedEmoji}.svg`}
              alt="смаил"
              loading="eager"
              width={32}
              height={32}
            />
          </span>
        )}
      </form>
      <span className={styles.icon}>
        <button onMouseEnter={toggleEmojiPicker}>{showEmojiPicker ? <VioletSmailIcon /> : <SmailIcon />}</button>
      </span>
      <div onMouseLeave={toggleEmojiPicker}>
        {showEmojiPicker && <EmodjiBlock handleEmojiSelect={handleEmojiSelect} recentEmoji={recentEmoji} />}
      </div>
    </div>
  );
};
