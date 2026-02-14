'use client';

import { TextInput } from 'modules/settings';
import { useEditProfileBlock } from 'modules/settings/lib/edit-profile-block/use-edit-profile-block';
import Image from 'next/image';
import { JSX } from 'react';
import { ButtonUI } from 'shared/ui';
import { DateSelector } from '../date-selector';
import styles from './edit-profile-block.module.scss';

export const EditProfileBlock: React.FC = ({}): JSX.Element => {
  const {
    birthday,
    firstName,
    lastName,
    login,
    info,
    isLoadingProfile,
    isSaving,
    errorProfile,
    errorSave,
    handleBirthdayChange,
    handleFirstNameChange,
    handleLastNameChange,
    handleLoginChange,
    handleInfoChange,
    handleReturnButton,
    handleSave,
  } = useEditProfileBlock();

  if (isLoadingProfile) {
    return <div>Загрузка профиля...</div>;
  }

  if (errorProfile) {
    return <div>Ошибка загрузки профиля: {errorProfile.message}</div>;
  }

  return (
    <div className={styles.container}>
      <button type="button" className={styles.returnButton} onClick={handleReturnButton}>
        <div className={styles.iconAndLabelContainer}>
          <Image
            src="/images/settings/returnArrowIcon.svg"
            alt=""
            width={21}
            height={21}
            className={styles.returnIcon}
          />
          <span className={styles.labelText}>Редактирование профиля</span>
        </div>
      </button>
      <div className={styles.imageContainer}>
        <Image src="/images/settings/noAvatarIcon.svg" alt="" width={200} height={200} className={styles.avatar} />
        <button type="button" className={styles.selectImage} onClick={() => {}}>
          Выбрать фотографию
        </button>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSave();
        }}
        className={styles.profileForm}
      >
        <TextInput
          label="Изменить имя"
          placeholder=""
          value={firstName}
          onChange={handleFirstNameChange}
          error={''}
          maxLength={30}
        />
        <TextInput
          label="Изменить фамилию"
          placeholder=""
          value={lastName}
          onChange={handleLastNameChange}
          error={''}
          maxLength={30}
        />
        <TextInput
          label="Изменить никнейм"
          placeholder=""
          value={login}
          onChange={handleLoginChange}
          error={''}
          maxLength={30}
        />
        <DateSelector label="Дата рождения" value={birthday} onChange={handleBirthdayChange} />
        <TextInput
          label="Напишите пару слов о себе"
          placeholder=""
          value={info}
          onChange={handleInfoChange}
          error={''}
          maxLength={100}
        />
        {errorSave && <div className={styles.error}>{errorSave.message}</div>}
        <ButtonUI
          variant="general"
          appearance="primary"
          label={isSaving ? 'Сохранение...' : 'Сохранить'}
          type="submit"
          disabled={isSaving}
        />
      </form>
    </div>
  );
};
