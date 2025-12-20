import Image from 'next/image';
import { JSX, useState } from 'react';
import { ButtonUI } from 'shared/ui/button';
import styles from './NameStep.module.scss';
import { TextInput } from './textInput/TextInput';

type NameStepProps = {
  next: () => void;
  prev: () => void;
};

export const NameStep: React.FC<NameStepProps> = ({ next, prev }: NameStepProps): JSX.Element => {
  const [firstName, setFirstName] = useState<string>('');
  const [login, setLogin] = useState<string>('');
  const [firstNameError, setFirstNameError] = useState<string | undefined>(undefined);
  const [loginError, setLoginError] = useState<string | undefined>(undefined);

  const handleFirstNameChange = (value: string): void => {
    setFirstName(value);
    if (value.trim() !== '' && !/^[a-zA-Zа-яА-ЯёЁ\s\-]+$/.test(value)) {
      setFirstNameError('Используйте только буквы, пробел или тире');
    } else if (value.length > 30) {
      setFirstNameError('Не более 30 символов');
    } else {
      setFirstNameError(undefined);
    }
  };

  const handleLoginChange = (value: string): void => {
    setLogin(value);
    if (value.trim() !== '' && !/^[a-zA-Zа-яА-ЯёЁ0-9_]+$/.test(value)) {
      setLoginError('Используйте только буквы, цифры и _');
    } else if (value.length > 30) {
      setLoginError('Не более 30 символов');
    } else {
      setLoginError(undefined);
    }
  };

  const isFormValid = firstName.trim() !== '' && login.trim() !== '' && !firstNameError && !loginError;

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    if (isFormValid) {
      next();
    }
  };
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
            error={firstNameError}
            maxLength={30}
          />
          <TextInput
            label="Введите никнейм"
            placeholder=""
            value={login}
            onChange={handleLoginChange}
            error={loginError}
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
          <ButtonUI variant="general" appearance="primary" label={'Зарегистрироваться'} onClick={handleSubmit} />
        </div>
      </form>
    </div>
  );
};
