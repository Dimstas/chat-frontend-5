import { JSX } from 'react';
import { Dropdown } from 'shared/ui/dropdown';
import { DropdownItem } from 'shared/ui/dropdown/dropdown.props';
import BlockIcon from './icons/block.svg';
import ClearIcon from './icons/clear.svg';
import CloseIcon from './icons/close.svg';
import DropdownIcon from './icons/dropdown.svg';
import ForwardIcon from './icons/forward.svg';
import styles from './profile-header.module.scss';
import { ProfileHeaderProps } from './profile-header.props';

export const ProfileHeader = ({ uid, isBlocked }: ProfileHeaderProps): JSX.Element => {
  const menuItems: DropdownItem[] = [
    {
      label: 'Поделиться профилем',
      icon: <ForwardIcon />,
      onClick: () => console.log('click forward'),
    },
    {
      label: 'Очистить чат',
      icon: <ClearIcon />,
      onClick: () => console.log('click clear'),
    },
  ];

  if (!isBlocked) {
    menuItems.push({
      label: 'Заблокировать',
      icon: <BlockIcon />,
      variant: 'alert',
      onClick: () => console.log('click block'),
    });
  }

  return (
    <div className={styles.header}>
      <button className={styles.delete}>
        <CloseIcon />
      </button>
      <span className={styles.label}>Информация</span>
      <Dropdown trigger={<DropdownIcon />} items={menuItems} />
    </div>
  );
};
