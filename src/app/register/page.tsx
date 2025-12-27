'use client';

import { CodeStep } from 'modules/register/ui/code-step';
import { FinalStep } from 'modules/register/ui/final-step';
import { NameStep } from 'modules/register/ui/name-step';
import { PhoneStep } from 'modules/register/ui/phone-step';
import { WelcomeStep } from 'modules/register/ui/welcome-step';
import { JSX, useState } from 'react';
import styles from './register.module.scss';

type Step = 1 | 2 | 3 | 4 | 5;

const RegisterPage = (): JSX.Element => {
  const [step, setStep] = useState<Step>(1);
  const [confirmedPhone, setConfirmedPhone] = useState<string>('');

  const handlePhoneConfirmed = (phone: string): void => {
    setConfirmedPhone(phone);
  };
  const nextStep = (): void => {
    if (step < 5) {
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
        {step === 5 && <FinalStep next={nextStep} />}
      </div>
    </div>
  );
};

export default RegisterPage;
