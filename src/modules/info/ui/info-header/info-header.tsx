import { JSX } from 'react';
import { Dropdown } from 'shared/ui/dropdown';

import CloseIcon from '../../shared/icons/close.svg';
import DropdownIcon from '../../shared/icons/dropdown.svg';
import SettingIcon from '../../shared/icons/settings.svg';

import styles from './info-header.module.scss';
import { InfoHeaderProps } from './info-header.props';

export const InfoHeader = ({
  menuItems,
  title,
  onClose,
  onSetting,
  backProps: backProps,
}: InfoHeaderProps): JSX.Element => {
  return (
    <div className={styles.header}>
      <div className={styles.info}>
        {onClose && (
          <button onClick={onClose}>
            <CloseIcon />
          </button>
        )}
        {backProps && <button onClick={backProps.onClick}>{backProps.icon}</button>}
        <span className={styles.label}>{title ?? 'Информация'}</span>
      </div>
      <div className={styles.menu}>
        {onSetting && (
          <button onClick={onSetting}>
            <SettingIcon />
          </button>
        )}
        {menuItems && <Dropdown trigger={<DropdownIcon />} items={menuItems} />}
      </div>
    </div>
  );
};
