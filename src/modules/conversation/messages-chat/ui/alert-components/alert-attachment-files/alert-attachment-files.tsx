'use client';
import { addRecentEmodji } from 'modules/conversation/messages-chat/utils/recent-emodji-array';
import {
  useRecentEmojiStore,
  useTextForAttachmentFilesStore,
} from 'modules/conversation/messages-chat/zustand-store/zustand-store';
import { JSX, useRef, useState } from 'react';
import { AutosizeTextarea } from '../../autosize-textarea/autosize-textarea';
import { EmodjiBlock } from '../../emodji-block/emodji-block';
import SmailIcon from '../../message-input/icon/smail.svg';
import VioletSmailIcon from '../../message-input/icon/violet-smail.svg';
import styles from './alert-attachment-files.module.scss';
import type {
  AlertAttachmentFilesProps,
  AlertButtonSmailProps,
  AlertMessageInputProps,
} from './alert-attachment-files.props';
import Close from './icons/close.svg';
import Submit from './icons/submit.svg';

export const AlertAttachmentFiles = ({ onOk, onCancel }: AlertAttachmentFilesProps): JSX.Element => {
  const [textInput, setTextInput] = useState<string>('');
  const setTextForAttachmentFilesStore = useTextForAttachmentFilesStore((s) => s.setTextForAttachmentFiles);
  const handleSubmitForm = (form: React.FormEvent<HTMLFormElement>): void => {
    form.preventDefault();
    setTextForAttachmentFilesStore(textInput);
    setTextInput('');
    onOk();
  };
  return (
    <div className={styles.wrapper}>
      <div className={styles.headerTop}>
        <div className={styles.textHeaderTop}>Отправить 10 файлов</div>
        <button className={styles.icon} onClick={onCancel}>
          <div className={styles.icon}>
            <Close />
          </div>
        </button>
      </div>
      <div className={styles.previewFilesList}>PreviewFileCardList</div>
      <form className={styles.headerBottomWrapper} onSubmit={handleSubmitForm}>
        <div className={styles.headerBottomBlock}>
          <AlertMessageInput textInput={textInput} setTextInput={setTextInput} />
          <button className={styles.headerBottomBlockIcon} type="submit">
            <div className={styles.headerBottomBlockIcon}>
              <Submit />
            </div>
          </button>
        </div>
      </form>
    </div>
  );
};

const AlertMessageInput = ({ textInput, setTextInput }: AlertMessageInputProps): JSX.Element => {
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const [pickerPos, setPickerPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const buttonRef = useRef<HTMLDivElement | null>(null);
  const recentEmojisStore = useRecentEmojiStore((s) => s.recentEmojis);
  const setRecentEmojisStore = useRecentEmojiStore((s) => s.setRecentEmojis);

  const handleEmojiSelect = (emoji: string): void => {
    setShowEmojiPicker(false);
    setRecentEmojisStore(addRecentEmodji(emoji));
    setTextInput(textInput + emoji);
    inputRef.current?.focus();
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
    <div className={styles.headerBottomInputBlock}>
      <AutosizeTextarea
        id="text"
        name="text"
        placeholder="Добавить подпись"
        value={textInput}
        onChange={(e) => setTextInput(e.target.value)}
        maxHeight={172}
        inputRef={inputRef}
        isScroll={false}
      />
      <ButtonSmail
        buttonRef={buttonRef}
        showEmojiPicker={showEmojiPicker}
        openEmojiPicker={openEmojiPicker}
        aria-label="Кнопка смаилов"
      />
      <div onMouseLeave={closeEmojiPicker}>
        {showEmojiPicker && (
          <EmodjiBlock
            handleEmojiSelect={handleEmojiSelect}
            recentEmojisStore={recentEmojisStore}
            position={pickerPos}
          />
        )}
      </div>
    </div>
  );
};

const ButtonSmail = ({ buttonRef, showEmojiPicker, openEmojiPicker }: AlertButtonSmailProps): JSX.Element => {
  return (
    <div className={styles.icon} ref={buttonRef}>
      {showEmojiPicker ? <VioletSmailIcon /> : <SmailIcon onMouseEnter={openEmojiPicker} />}
    </div>
  );
};
