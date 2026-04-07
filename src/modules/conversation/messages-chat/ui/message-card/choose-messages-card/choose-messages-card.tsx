'use client';
import { useAlert } from 'modules/conversation/messages-chat/hooks/use-alert';
import { copyMessageToClipboard } from 'modules/conversation/messages-chat/utils/copy-message-to-clipboard';
import { formatMessages } from 'modules/conversation/messages-chat/utils/format-messages';
import {
  useSelectedUidUserForForwardMessageStore,
  useToastVisibleStore,
} from 'modules/conversation/messages-chat/zustand-store/zustand-store';
import { useRouter } from 'next/navigation';
import { JSX, useEffect, useRef } from 'react';
import Close from '../icons/close-choose.svg';
import Copy from '../icons/copy-choose.svg';
import Delete from '../icons/delete.svg';
import Forward from '../icons/forward.svg';
import styles from './choose-messages-card.module.scss';
import type { ChooseMessagesCardProps } from './choose-messages-card.props';

export const ChooseMessagesCard = ({
  setCheckBoxsVisibleStore,
  selectedMessagesStore,
  clearSelectedMessagesStore,
  sendDeleteMessage,
}: ChooseMessagesCardProps): JSX.Element => {
  const handleClose = (): void => {
    setCheckBoxsVisibleStore(false);
    clearSelectedMessagesStore();
  };

  const { confirm } = useAlert();
  const router = useRouter();
  const selectedUidUserForForwardMessageStore = useSelectedUidUserForForwardMessageStore(
    (s) => s.selectedUidUserForForwardMessage,
  );
  const selectedUidUserForForwardMessageRef = useRef<string>(selectedUidUserForForwardMessageStore);
  useEffect(() => {
    selectedUidUserForForwardMessageRef.current = selectedUidUserForForwardMessageStore;
  }, [selectedUidUserForForwardMessageStore, selectedUidUserForForwardMessageRef]);
  //обработчик для меню 'пересласть'
  const handleForwardClick = async (): Promise<void> => {
    if (!selectedMessagesStore?.length) return;
    const ok = await confirm({
      isMessageForwarding: true,
    });
    if (ok && selectedUidUserForForwardMessageRef.current) {
      setCheckBoxsVisibleStore(false);
      router.push(`/chats/${selectedUidUserForForwardMessageRef.current}`);
    }
  };
  const setToastVisibleStore = useToastVisibleStore((s) => s.setToastVisible);
  //обработчик для меню 'копировать'
  const handleCopyClick = (): void => {
    if (!selectedMessagesStore?.length) return;
    const messagesText =
      selectedMessagesStore?.reduce((acc, m) => {
        acc = acc + `${m.content} `;
        return acc;
      }, '') ?? '';
    copyMessageToClipboard(messagesText, setToastVisibleStore);
    setCheckBoxsVisibleStore(false);
    clearSelectedMessagesStore();
  };
  //обработчик для меню 'удалить'
  const handleDeleteClick = async (): Promise<void> => {
    if (!selectedMessagesStore?.length) return;
    const ok = await confirm({
      title: 'Удалить сообщения',
      message: 'Вы действительно хотите удалить сообщения?',
    });
    if (ok) {
      selectedMessagesStore?.forEach((m) => sendDeleteMessage(m, true));
      setCheckBoxsVisibleStore(false);
      clearSelectedMessagesStore();
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.info}>
        <div className={styles.icon}>
          <div className={styles.icon} onClick={handleClose}>
            <Close />
          </div>
        </div>
        <div className={styles.text}>{`Выбрано ${formatMessages(selectedMessagesStore?.length ?? 0)}`}</div>
      </div>
      <div className={styles.icon}>
        <div className={styles.icon} onClick={handleForwardClick}>
          <Forward />
        </div>
      </div>
      <div className={styles.icon}>
        <div className={styles.icon} onClick={handleCopyClick}>
          <Copy />
        </div>
      </div>
      <div className={styles.icon}>
        <div className={styles.icon} onClick={handleDeleteClick}>
          <Delete />
        </div>
      </div>
    </div>
  );
};
