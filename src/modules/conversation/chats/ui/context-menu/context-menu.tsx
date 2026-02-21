import clsx from 'clsx';
import { useAddContactQuery } from 'modules/conversation/contacts/api/contact.query';
import { useContactsSelectionStore } from 'modules/conversation/contacts/features/contacts-selection';
import { JSX } from 'react';
import styles from './context-menu.module.scss';
import AddContact from './icons/add-contact.svg';
import DeleteOutline from './icons/delete-outline.svg';
import MarkRead from './icons/mark-read.svg';
import PushPin from './icons/push-pin.svg';
import VolumeOf from './icons/volume-off.svg';

export const ContextMenu = ({
  uid,
  position,
  visible,
  onClose,
}: {
  uid: string;
  position: { x: number; y: number };
  visible: boolean;
  onClose: () => void;
}): JSX.Element | null => {
  const { mutate: addContact } = useAddContactQuery();
  const findGlobalByUid = useContactsSelectionStore((s) => s.findGlobalByUid);

  if (!visible) return null;

  const handleAddContact = (): void => {
    const contact = findGlobalByUid(uid);
    if (!!contact) {
      addContact({ phone: contact?.phone, first_name: contact?.firstName, last_name: contact?.lastName });
    }
    onClose();
  };

  return (
    <div className={styles.wrapper} onMouseLeave={onClose} style={{ top: position.y, left: position.x }}>
      <button className={clsx(styles.cell, styles.cellTop)} onClick={handleAddContact}>
        <div className={styles.text}>Добавить в контакты </div>
        <div className={styles.icon}>
          <AddContact />
        </div>
      </button>
      <button className={styles.cell} onClick={onClose}>
        <div className={styles.text}>Выключить уведомления</div>
        <div className={styles.icon}>
          <VolumeOf />
        </div>
      </button>
      <button className={styles.cell} onClick={onClose}>
        <div className={styles.text}>Закрепить</div>
        <div className={styles.icon}>
          <PushPin />
        </div>
      </button>
      <button className={styles.cell} onClick={onClose}>
        <div className={styles.text}>Пометить прочитанным</div>
        <div className={styles.icon}>
          <MarkRead />
        </div>
      </button>
      <button className={clsx(styles.cell, styles.cellBottom)} onClick={onClose}>
        <div className={clsx(styles.text, styles.textRed)}>Удалить чат</div>
        <div className={styles.icon}>
          <DeleteOutline />
        </div>
      </button>
    </div>
  );
};
