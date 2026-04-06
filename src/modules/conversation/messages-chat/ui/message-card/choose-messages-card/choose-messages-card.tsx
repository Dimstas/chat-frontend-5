'use client';
import { useAlert } from 'modules/conversation/messages-chat/hooks/use-alert';
import { formatMessages } from 'modules/conversation/messages-chat/utils/format-messages';
import { useSelectedUidUserForForwardMessageStore } from 'modules/conversation/messages-chat/zustand-store/zustand-store';
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

  const handleForwardClick = async (): Promise<void> => {
    const ok = await confirm({
      isMessageForwarding: true,
    });
    if (ok && selectedUidUserForForwardMessageRef.current) {
      setCheckBoxsVisibleStore(false);
      router.push(`/chats/${selectedUidUserForForwardMessageRef.current}`);
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
        <div className={styles.icon}>
          <Copy />
        </div>
      </div>
      <div className={styles.icon}>
        <div className={styles.icon}>
          <Delete />
        </div>
      </div>
    </div>
  );
};
