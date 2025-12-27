import { JSX } from 'react';
import { ProfileBlockProps } from '../profile-block/profile-block.props';
import CloseIcon from './icons/close.svg';
import DropdownIcon from './icons/dropdown.svg';
import styles from './profile-header.module.scss';

export const ProfileHeader = ({ uid }: ProfileBlockProps): JSX.Element => {
  return (
    <div className={styles.header}>
      <button className={styles.delete}>
        <CloseIcon />
      </button>
      <span className={styles.label}>Информация</span>
      <button className={styles.dropdown}>
        <DropdownIcon />
      </button>
    </div>
  );
};
