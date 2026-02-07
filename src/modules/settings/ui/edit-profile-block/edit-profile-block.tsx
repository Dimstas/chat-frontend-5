'use client';
import Image from 'next/image';
import { JSX } from 'react';
import styles from './edit-profile-block.module.scss';

type EditProfileBlockProps = {
  login: string;
};

export const EditProfileBlock: React.FC<EditProfileBlockProps> = ({ login }: EditProfileBlockProps): JSX.Element => {
  return (
    <div className={styles.container}>
      <button type="button" className={styles.returnButton} onClick={() => {}}>
        <div className={styles.iconAndLabelContainer}>
          <Image
            src="/images/settings/returnArrowIcon.svg"
            alt=""
            width={21}
            height={21}
            className={styles.trashIcon}
          />
          <span className={styles.labelText}>Редактирование профиля</span>
        </div>
      </button>
    </div>
  );
};
