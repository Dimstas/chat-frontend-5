import clsx from 'clsx';
import { JSX } from 'react';
import { useHeaderButtonsModalStore } from '../../zustand-store/zustand-store';
import styles from './header-top-buttons-block.module.scss';
import CloseIcon from './icon/close.svg';
export const HeaderTopButtonsBlock = (): JSX.Element => {
  const { openBlockModal } = useHeaderButtonsModalStore();

  return (
    <div className={styles.wrapper}>
      <button className={clsx(styles.buttonsWrapper, styles.addContact)}>Добавить в контакты</button>
      <button className={clsx(styles.buttonsWrapper, styles.blockContact)} onClick={openBlockModal}>
        Заблокировать
      </button>
      <button className={styles.icon}>
        <CloseIcon />
      </button>
    </div>
  );
};
