import Image from 'next/image';
import { JSX } from 'react';
import { ButtonUI } from 'shared/ui/button';
import { Modal } from 'shared/ui/modal';
import { usePhoneStep } from '../../lib/steps/usePhoneStep';
import { PhoneNumberInput } from '../../ui/phone-number-input';
import styles from './phone-step.module.scss';

type PhoneStepProps = {
  next: () => void;
  prev: () => void;
  onPhoneConfirmed: (phone: string) => void;
};

export const PhoneStep: React.FC<PhoneStepProps> = ({ next, prev, onPhoneConfirmed }: PhoneStepProps): JSX.Element => {
  const {
    phoneValue,
    isButtonEnabled,
    isModalOpen,
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
          <PhoneNumberInput onChange={handlePhoneChange} onValidationChange={handleValidationChange} />
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
