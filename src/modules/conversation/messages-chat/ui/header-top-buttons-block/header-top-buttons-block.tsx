import clsx from 'clsx';
import { useAddContactQuery, useSearchUserByNicknameQuery } from 'modules/info/api/info.query';
import { usePathname } from 'next/navigation';
import { JSX } from 'react';
import { useHeaderButtonsModalStore } from '../../zustand-store/zustand-store';
import styles from './header-top-buttons-block.module.scss';
import CloseIcon from './icon/close.svg';
export const HeaderTopButtonsBlock = ({
  nickname,
  isInContact,
  isBlocked,
}: {
  nickname: string;
  isInContact: boolean;
  isBlocked: boolean;
}): JSX.Element | null => {
  const { openBlockModal, openAddModal, isButtonMenuOpen, closeButtonMenu } = useHeaderButtonsModalStore();
  const { mutate: addToContact } = useAddContactQuery();

  const { data: users } = useSearchUserByNicknameQuery(nickname);
  const user = users ? users[0] : undefined;

  const pathname = usePathname();
  const isGroup = pathname.startsWith('/chats/group');

  const handleAddContact = (): void => {
    if (!!user) {
      addToContact({ phone: user?.phone, first_name: user?.first_name, last_name: user?.last_name });
      openAddModal();
    }
  };

  if (!isButtonMenuOpen) return null;

  return (
    <div className={styles.wrapper}>
      {isGroup ? (
        <button
          className={clsx(styles.buttonsWrapper, styles.addContact, { [styles.blocked]: isInContact })}
          disabled={isInContact}
        >
          Добавить участников
        </button>
      ) : (
        <>
          <button
            className={clsx(styles.buttonsWrapper, styles.addContact, { [styles.blocked]: isInContact })}
            disabled={isInContact}
            onClick={handleAddContact}
          >
            Добавить в контакты
          </button>
          <button
            className={clsx(styles.buttonsWrapper, styles.blockContact, { [styles.blocked]: isBlocked })}
            disabled={isBlocked}
            onClick={openBlockModal}
          >
            Заблокировать
          </button>
        </>
      )}

      <button className={styles.icon} onClick={closeButtonMenu}>
        <CloseIcon />
      </button>
    </div>
  );
};
