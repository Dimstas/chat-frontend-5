import { formatMessages } from 'modules/conversation/messages-chat/utils/format-messages';
import { useSelectedMessagesStore } from 'modules/conversation/messages-chat/zustand-store/zustand-store';
import { JSX } from 'react';
import Close from '../icons/close-choose.svg';
import Copy from '../icons/copy-choose.svg';
import Delete from '../icons/delete.svg';
import Forward from '../icons/forward.svg';
import styles from './choose-messages-card.module.scss';
import type { ChooseMessagesCardProps } from './choose-messages-card.props';

export const ChooseMessagesCard = ({ setcheckBoxsVisibleStore }: ChooseMessagesCardProps): JSX.Element => {
  const clearSelectedMessagesStore = useSelectedMessagesStore((s) => s.clearSelectedMessages);
  const selectedMessagesStore = useSelectedMessagesStore((s) => s.selectedMessages) ?? [];
  const handleClose = (): void => {
    setcheckBoxsVisibleStore(false);
    clearSelectedMessagesStore();
  };
  return (
    <div className={styles.wrapper}>
      <div className={styles.info}>
        <div className={styles.icon}>
          <div className={styles.icon} onClick={handleClose}>
            <Close />
          </div>
        </div>
        <div className={styles.text}>{`Выбрано ${formatMessages(selectedMessagesStore.length)}`}</div>
      </div>
      <div className={styles.icon}>
        <div className={styles.icon}>
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
