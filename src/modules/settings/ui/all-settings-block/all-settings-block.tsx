'use client';
import Image from 'next/image';
import { JSX } from 'react';
import { useGetProfile } from 'shared/query/profile.query';
import { SettingsList } from '../settings-list/settings-list';
import { UserCard } from '../user-card/user-card';

import { useRouter } from 'next/navigation';
import { deleteProfile } from 'shared/api/profile.api';
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
  const { data: profile } = useGetProfile();

  const router = useRouter();
  if (!profile) {
    return <div>Загрузка профиля</div>;
  }

  console.log(profile);

  const handleDeleteAccount = async (): Promise<void> => {
    try {
      const response = await deleteProfile(profile.uid);
      console.log('Удаление успешно:', response.messages);
      router.push('/auth');
    } catch (error) {
      console.error('Ошибка при удалении аккаунта:', error);
    }
  };
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Настройки</h1>
        <UserCard
          avatar={profile.avatar ? profile.avatar : ''}
          name={profile.first_name}
          phone={profile.phone}
          nickName={`@${profile.nickname}`}
        />
        <SettingsList editProfile={editProfile} blackList={blackList} support={support} leave={leave} />
      </div>
      <button type="button" className={styles.removeProfileButton} onClick={handleDeleteAccount}>
        <div className={styles.iconAndLabelContainer}>
          <Image src="/images/settings/trashIcon.svg" alt="" width={21} height={21} className={styles.trashIcon} />
          <span className={styles.labelText}>Удалить профиль</span>
        </div>
      </button>
    </div>
  );
};
