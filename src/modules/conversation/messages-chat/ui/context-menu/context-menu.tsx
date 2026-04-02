'use client';
import clsx from 'clsx';
import { JSX } from 'react';
import { copyMessageToClipboard } from '../../utils/copy-message-to-clipboard';
import {
  useForwardMessageStore,
  useRepliedMessageStore,
  useSelectedMessagesStore,
} from '../../zustand-store/zustand-store';
import styles from './context-menu.module.scss';
import type { ContextMenuProps } from './context-menu.props';
import Answer from './icons/answer.svg';
import Check from './icons/check.svg';
import Copy from './icons/copy.svg';
import Delete from './icons/delete.svg';
import Forward from './icons/forward.svg';

export const ContextMenu = ({
  position,
  visible,
  onClose,
  handleDeleteClick,
  handleForwardClick,
  setToastVisible,
  setCheckBoxsVisible,
  message,
}: ContextMenuProps): JSX.Element | null => {
  const setRepliedMessageStore = useRepliedMessageStore((s) => s.setRepliedMessage);
  const clearForwardMessageStore = useForwardMessageStore((s) => s.clearForwardMessage);

  const handleAnswerClick = (): void => {
    setRepliedMessageStore(message);
    clearForwardMessageStore();
    onClose();
  };
  //обработчика для контекстного меню 'Cкопировать'
  const handleCopyClick = (msgText: string): void => {
    copyMessageToClipboard(msgText, setToastVisible);
    onClose();
  };
  const addSelectedMessagesStore = useSelectedMessagesStore((s) => s.addSelectedMessages);
  const clearSelectedMessagesStore = useSelectedMessagesStore((s) => s.clearSelectedMessages);
  const handleSelectedClick = (): void => {
    setCheckBoxsVisible(true);
    clearSelectedMessagesStore();
    addSelectedMessagesStore(message);
    onClose();
  };

  if (!visible) return null;
  return (
    <div className={styles.wrapper} onMouseLeave={onClose} style={{ top: position.y, left: position.x }}>
      <button className={clsx(styles.cell, styles.cellTop)} onClick={handleAnswerClick}>
        <div className={styles.text}>Ответить</div>
        <div className={styles.icon}>
          <Answer />
        </div>
      </button>
      <button className={styles.cell} onClick={handleForwardClick}>
        <div className={styles.text}>Переслать</div>
        <div className={styles.icon}>
          <Forward />
        </div>
      </button>
      <button className={styles.cell} onClick={() => handleCopyClick(message.content ?? '')}>
        <div className={styles.text}>Скопировать</div>
        <div className={styles.icon}>
          <Copy />
        </div>
      </button>
      <button className={styles.cell} onClick={handleSelectedClick}>
        <div className={styles.text}>Выбрать</div>
        <div className={styles.icon}>
          <Check />
        </div>
      </button>
      <button className={clsx(styles.cell, styles.cellBottom)} onClick={handleDeleteClick}>
        <div className={clsx(styles.text, styles.textRed)}>Удалить</div>
        <div className={styles.icon}>
          <Delete />
        </div>
      </button>
    </div>
  );
};
