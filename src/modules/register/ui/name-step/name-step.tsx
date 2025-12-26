// src/modules/register/ui/name-step/name-step.tsx
import Image from 'next/image';
import { JSX } from 'react';
import { ButtonUI } from 'shared/ui/button'; // Обновите путь
import { TextInput } from '../text-input'; // Обновите путь
import { useNameStep } from '../../lib/steps/useNameStep'; // Импортируем хук
import styles from './name-step.module.scss';

type NameStepProps = {
  next: () => void;
  prev: () => void;
};

export const NameStep: React.FC<NameStepProps> = ({ next, prev }: NameStepProps): JSX.Element => {
  const {
    firstName,
    login,
    firstNameError,
    loginError,
    isFormValid,
    handleFirstNameChange,
    handleLoginChange,
    handleSubmit,
  } = useNameStep({ next });

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <button className={styles.arrowButton} onClick={prev}></button>
          <Image
            src="/images/register/welcomeLogo.png"
            alt="Добро пожаловать"
            width={70}
            height={70}
            className={styles.image}
          />
        </div>
        <h1 className={styles.title}>Личная информация</h1>
      </div>
      <p className={styles.text}>Пожалуйста, заполните данные</p>

      <form onSubmit={handleSubmit} className={styles.profileForm}>
        <div className={styles.inputsContainer}>
          <TextInput
            label="Введите имя"
            placeholder=""
            value={firstName}
            onChange={handleFirstNameChange}
            error={firstNameError} // Передаём ошибку, которая устанавливается при onChange или submit
            maxLength={30}
          />
          <TextInput
            label="Введите никнейм"
            placeholder=""
            value={login}
            onChange={handleLoginChange}
            error={loginError} // Передаём ошибку, которая устанавливается при onChange или submit
            maxLength={30}
          />
        </div>
        <div className={styles.buttonContainer}>
          <p className={styles.agreementText}>
            Нажимая на «Зарегистрироваться», вы соглашаетесь
            <br /> с{' '}
            <a href="" className={styles.link}>
              Пользовательским соглашением
            </a>
          </p>
          <ButtonUI
            variant="general"
            appearance="primary"
            label={'Зарегистрироваться'}
            type="submit" // Добавим type="submit", чтобы форма корректно работала
            disabled={!isFormValid} // Кнопка может быть неактивной, если форма не валидна (поля пустые или есть другие ошибки)
          />
        </div>
      </form>
    </div>
  );
};