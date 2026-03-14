import { useInfoStore } from 'modules/info/model/info.store';
import { JSX } from 'react';
import { Dropdown } from 'shared/ui/dropdown';
import { DropdownItem } from 'shared/ui/dropdown/dropdown.props';
import BlockIcon from './icons/block.svg';
import ClearIcon from './icons/clear.svg';
import CloseIcon from './icons/close.svg';
import DropdownIcon from './icons/dropdown.svg';
import ForwardIcon from './icons/forward.svg';
import styles from './info-header.module.scss';
import { InfoHeaderProps } from './info-header.props';

export const InfoHeader = ({ isBlocked }: InfoHeaderProps): JSX.Element => {
  const { toggleInfoOpen, openBlockModal, openClearModal } = useInfoStore();

  const menuItems: DropdownItem[] = [
    {
      label: 'Поделиться профилем',
      icon: <ForwardIcon />,
      onClick: () => console.log('click forward'),
    },
    {
      label: 'Очистить чат',
      icon: <ClearIcon />,
      onClick: openClearModal,
    },
  ];

  if (!isBlocked) {
    menuItems.push({
      label: 'Заблокировать',
      icon: <BlockIcon />,
      variant: 'alert',
      onClick: openBlockModal,
    });
  }

  return (
    <div className={styles.header}>
      <button className={styles.delete} onClick={toggleInfoOpen}>
        <CloseIcon />
      </button>
      <span className={styles.label}>Информация</span>
      <Dropdown trigger={<DropdownIcon />} items={menuItems} />
    </div>
  );
};
