import { JSX } from 'react';
import { Dropdown } from 'shared/ui/dropdown';

import BackIcon from '../../shared/icons/back.svg';
import CloseIcon from '../../shared/icons/close.svg';
import DropdownIcon from '../../shared/icons/dropdown.svg';

import styles from './info-header.module.scss';
import { InfoHeaderProps } from './info-header.props';

export const InfoHeader = ({ menuItems, title, onClose, onBack }: InfoHeaderProps): JSX.Element => {
  return (
    <div className={styles.header}>
      {onClose && (
        <button className={styles.delete} onClick={onClose}>
          <CloseIcon />
        </button>
      )}
      {onBack && (
        <button onClick={onBack}>
          <BackIcon />
        </button>
      )}
      <span className={styles.label}>{title ?? 'Информация'}</span>
      {menuItems && <Dropdown trigger={<DropdownIcon />} items={menuItems} />}
    </div>
  );
};
