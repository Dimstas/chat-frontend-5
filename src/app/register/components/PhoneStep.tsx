import Image from 'next/image';
import { JSX, useState } from 'react';
import { ButtonUI } from 'shared/ui/button';
import { Modal } from 'shared/ui/modal';
import { PhoneNumberInput } from './phoneNumberInput/PhoneNumberInput';
import styles from './phoneStep.module.scss';

type PhoneStepProps = {
  next: () => void;
  prev: () => void;
  onPhoneConfirmed: (phone: string) => void;
};

export const PhoneStep: React.FC<PhoneStepProps> = ({ next, prev, onPhoneConfirmed }: PhoneStepProps): JSX.Element => {
  const [isPhoneValid, setIsPhoneValid] = useState<boolean>(false);
  const [isPhoneFilled, setIsPhoneFilled] = useState<boolean>(false);
  const [phoneValue, setPhoneValue] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleValidationChange = (isValid: boolean, isFilled: boolean): void => {
    setIsPhoneValid(isValid);
    setIsPhoneFilled(isFilled);
  };

  const handlePhoneChange = (value: string): void => {
    setPhoneValue(value);
  };

  const handleNextClick = (): void => {
    if (isButtonEnabled) {
      setIsModalOpen(true);
    }
  };

  const handleConfirmPhone = (): void => {
    setIsModalOpen(false);
    onPhoneConfirmed(phoneValue);
    next();
  };

  const handleCloseModal = (): void => {
    setIsModalOpen(false);
  };

  const isButtonEnabled = isPhoneFilled && isPhoneValid;

  return (
    <>
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
          <h1 className={styles.title}>Вход/регистрация</h1>
          <PhoneNumberInput onChange={handlePhoneChange} onValidationChange={handleValidationChange} />
        </div>
        <ButtonUI
          variant="general"
          appearance={isButtonEnabled ? 'primary' : 'disabled'}
          label={'Далее'}
          onClick={handleNextClick}
        />
      </div>

      {isModalOpen && (
        <Modal
          title={phoneValue}
          content="Номер телефона указан верно?"
          firstButtonText="Верно"
          secondButtonText="Изменить"
          onFirstButtonClick={handleConfirmPhone}
          onSecondButtonClick={handleCloseModal}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
};
