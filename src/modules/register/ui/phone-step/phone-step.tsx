
import { ButtonUI } from 'shared/ui/button';
import { Modal } from 'shared/ui/modal';
import { PhoneNumberInput } from '../../ui/phone-number-input';
import { usePhoneStep } from '../../lib/steps/usePhoneStep';
import styles from './phone-step.module.scss';
import Image from 'next/image';
import { JSX } from 'react';


type PhoneStepProps = {
  next: () => void;
  prev: () => void;
  onPhoneConfirmed: (phone: string) => void;
};

export const PhoneStep: React.FC<PhoneStepProps> = ({ next, prev, onPhoneConfirmed }): JSX.Element => {
  const {
    phoneValue,
    isButtonEnabled,
    isModalOpen,
    isLoading,
    error,
    handleValidationChange,
    handlePhoneChange,
    handleNextClick,
    handleConfirmPhone,
    handleCloseModal,
  } = usePhoneStep({ next, onPhoneConfirmed });

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
          <PhoneNumberInput
            onChange={handlePhoneChange}
            onValidationChange={handleValidationChange}
          />
          {error && <p className={styles.errorText}>{error}</p>}
        </div>
        <ButtonUI
          variant="general"
          appearance={isButtonEnabled ? 'primary' : 'disabled'}
          label={'Далее'} 
          onClick={handleNextClick}
          disabled={!isButtonEnabled}
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