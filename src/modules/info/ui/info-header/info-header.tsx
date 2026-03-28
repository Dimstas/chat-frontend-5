import { useInfoStore } from 'modules/info/model/info.store';
import { JSX } from 'react';
import { Dropdown } from 'shared/ui/dropdown';

import CloseIcon from '../../shared/icons/close.svg';
import DropdownIcon from '../../shared/icons/dropdown.svg';

import styles from './info-header.module.scss';
import { InfoHeaderProps } from './info-header.props';

export const InfoHeader = ({ menuItems, title }: InfoHeaderProps): JSX.Element => {
  const { toggleInfoOpen } = useInfoStore();

  return (
    <div className={styles.header}>
      <button className={styles.delete} onClick={toggleInfoOpen}>
        <CloseIcon />
      </button>
      <span className={styles.label}>{title ?? 'Информация'}</span>
      <Dropdown trigger={<DropdownIcon />} items={menuItems} />
    </div>
  );
};
