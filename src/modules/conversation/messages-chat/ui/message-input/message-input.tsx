'use client';
import { JSX, useRef, useState } from 'react';
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
  const [pickerPos, setPickerPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const buttonRef = useRef<HTMLDivElement | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setMessage(event.target.value);
  };
  const handleEmojiSelect = (emoji: string): void => {
    setSelectedEmoji(emoji);
    setShowEmojiPicker(false);
    setRecentEmoji(addRecentEmodji(emoji));
  };
  const openEmojiPicker = (): void => {
    if (buttonRef.current) {
      const { y, x } = buttonRef.current.getBoundingClientRect();
      const heightPicker = 535;
      const widthPicker = 472;
      const adjustedX = x + widthPicker + 295 - window.innerWidth > 0 ? x - widthPicker + 45 : x;
      const adjustedY = y - heightPicker - 15;
      setPickerPos({ x: adjustedX, y: adjustedY });
    }
    setShowEmojiPicker(true);
  };

  const closeEmojiPicker = (): void => {
    setShowEmojiPicker(false);
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
      <div className={styles.icon} ref={buttonRef}>
        <button onMouseEnter={openEmojiPicker}>{showEmojiPicker ? <VioletSmailIcon /> : <SmailIcon />}</button>
      </div>
      <div onMouseLeave={closeEmojiPicker}>
        {showEmojiPicker && (
          <EmodjiBlock handleEmojiSelect={handleEmojiSelect} recentEmoji={recentEmoji} position={pickerPos} />
        )}
      </div>
    </div>
  );
};
