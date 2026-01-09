import clsx from 'clsx';
import { FC } from 'react';
import styles from './dropdown.module.scss';
import { DropdownItem, DropdownProps } from './dropdown.props';
import { useDropdown } from './hooks/useDropdown';
import { MenuItem } from './menu-item';

export const Dropdown: FC<DropdownProps> = ({ trigger, items }) => {
  const { isOpen, toggleMenu, closeMenu, dropdownRef, menuRef } = useDropdown();

  const handleClickMenuItem = (item: DropdownItem): void => {
    if (isOpen) {
      closeMenu();
    }
    if (item.onClick) item.onClick();
  };

  return (
    <div className={styles.dropdown} ref={dropdownRef}>
      <div className={styles.trigger} onClick={toggleMenu}>
        {trigger}
      </div>

      <div className={clsx(styles.menu, isOpen ? styles.open : styles.hidden)} ref={menuRef}>
        {items.map((item, index) => (
          <MenuItem
            key={index}
            text={item.label}
            icon={item.icon}
            variant={item.variant}
            onClick={() => handleClickMenuItem(item)}
          />
        ))}
      </div>
    </div>
  );
};
