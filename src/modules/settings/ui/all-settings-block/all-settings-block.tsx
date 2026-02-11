'use client';
import Image from 'next/image';
import { JSX } from 'react';
import { SettingsList } from '../settings-list/settings-list';
import { UserCard } from '../user-card/user-card';
import styles from './all-settings-block.module.scss';

type AllSettingsBlockProps = {
  editProfile: () => void;
  blackList: () => void;
  support: () => void;
  leave: () => void;
};

export const AllSettingsBlock: React.FC<AllSettingsBlockProps> = ({
  editProfile,
  blackList,
  support,
  leave,
}: AllSettingsBlockProps): JSX.Element => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Настройки</h1>
        <UserCard avatar={''} name={'asdsa'} phone={'dfsf'} nickName={'asdf'} />
        <SettingsList editProfile={editProfile} blackList={blackList} support={support} leave={leave} />
      </div>
      <button type="button" className={styles.removeProfileButton} onClick={() => {}}>
        <div className={styles.iconAndLabelContainer}>
          <Image src="/images/settings/trashIcon.svg" alt="" width={21} height={21} className={styles.trashIcon} />
          <span className={styles.labelText}>Удалить профиль</span>
        </div>
      </button>
    </div>
  );
};
