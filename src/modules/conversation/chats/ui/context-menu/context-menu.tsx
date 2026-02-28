import clsx from 'clsx';
import { useAddContactQuery } from 'modules/conversation/contacts/api/contact.query';
import { useSearchUserByNicknameQuery } from 'modules/info/api/info.query';
import { JSX } from 'react';
import styles from './context-menu.module.scss';
import AddContact from './icons/add-contact.svg';
import DeleteOutline from './icons/delete-outline.svg';
import MarkRead from './icons/mark-read.svg';
import PushPin from './icons/push-pin.svg';
import VolumeOf from './icons/volume-off.svg';

export const ContextMenu = ({
  uid,
  nickname,
  isInContacts,
  position,
  visible,
  onClose,
}: {
  uid: string;
  nickname: string;
  isInContacts: boolean;
  position: { x: number; y: number };
  visible: boolean;
  onClose: () => void;
}): JSX.Element | null => {
  const { mutate: addContact } = useAddContactQuery();
  const { data: users } = useSearchUserByNicknameQuery(nickname);

  if (!visible) return null;

  const handleAddContact = (): void => {
    const contact = users ? users[0] : undefined;
    if (!!contact) {
      addContact({ phone: contact?.phone, first_name: contact?.first_name, last_name: contact?.last_name });
    }
    onClose();
  };

  return (
    <div className={styles.wrapper} onMouseLeave={onClose} style={{ top: position.y, left: position.x }}>
      {!isInContacts && (
        <button className={clsx(styles.cell, styles.cellTop)} onClick={handleAddContact}>
          <div className={styles.text}>Добавить в контакты </div>
          <div className={styles.icon}>
            <AddContact />
          </div>
        </button>
      )}
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
