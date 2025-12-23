'use client';

import { JSX, useState } from 'react';
import { CodeStep } from './components/CodeStep';
import { NameStep } from './components/NameStep';
import { PhoneStep } from './components/PhoneStep';
import { WelcomeStep } from './components/WelcomeStep';
import styles from './register.module.scss';

type Step = 1 | 2 | 3 | 4;

const RegisterPage = (): JSX.Element => {
  const [step, setStep] = useState<Step>(1);
  const [confirmedPhone, setConfirmedPhone] = useState<string>('');

  const handlePhoneConfirmed = (phone: string): void => {
    setConfirmedPhone(phone);
    console.log('Подтверждённый номер:', phone);
  };
  const nextStep = (): void => {
    if (step < 4) {
      setStep((step + 1) as Step);
    }
  };

  const prevStep = (): void => {
    if (step > 1) {
      setStep((step - 1) as Step);
    }
  };

  return (
    <div className={styles.registerPage}>
      <div className={styles.formContainer}>
        {step === 1 && <WelcomeStep next={nextStep} />}
        {step === 2 && <PhoneStep next={nextStep} prev={prevStep} onPhoneConfirmed={handlePhoneConfirmed} />}
        {step === 3 && <CodeStep next={nextStep} prev={prevStep} phone={confirmedPhone} />}
        {step === 4 && <NameStep next={nextStep} prev={prevStep} />}
      </div>
    </div>
  );
};

export default RegisterPage;
