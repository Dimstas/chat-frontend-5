'use client';
import { JSX, useRef, useState } from 'react';
import { ImageUI } from 'shared/ui/image';
import { addRecentEmodji } from '../../utils/recent-emodji-array';
import { AutosizeTextarea } from '../autosize-textarea/autosize-textarea';
import { EmodjiBlock } from '../emodji-block/emodji-block';
import SmailIcon from './icon/smail.svg';
import VioletSmailIcon from './icon/violet-smail.svg';
import styles from './message-input.module.scss';

export const MessageInput = ({
  textInput,
  setTextInput,
}: {
  textInput: string;
  setTextInput: (text: string) => void;
}): JSX.Element => {
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
  const [recentEmoji, setRecentEmoji] = useState<string[]>([]);
  const [pickerPos, setPickerPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const buttonRef = useRef<HTMLDivElement | null>(null);

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
      <div className={styles.form}>
        <AutosizeTextarea
          id="text"
          name="text"
          placeholder="Текст сообщения"
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          maxHeight={472}
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
      </div>
      <div className={styles.icon} ref={buttonRef}>
        {showEmojiPicker ? <VioletSmailIcon /> : <SmailIcon onMouseEnter={openEmojiPicker} />}
      </div>
      <div onMouseLeave={closeEmojiPicker}>
        {showEmojiPicker && (
          <EmodjiBlock handleEmojiSelect={handleEmojiSelect} recentEmoji={recentEmoji} position={pickerPos} />
        )}
      </div>
    </div>
  );
};
