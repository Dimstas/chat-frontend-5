// src/modules/register/model/usePhoneStep.ts
import { useState, useCallback } from 'react';

interface UsePhoneStepProps {
  next: () => void;
  onPhoneConfirmed: (phone: string) => void;
}

interface UsePhoneStepReturn {
  phoneValue: string;
  isButtonEnabled: boolean;
  isModalOpen: boolean;
  handleValidationChange: (isValid: boolean, isFilled: boolean) => void;
  handlePhoneChange: (value: string) => void;
  handleNextClick: () => void;
  handleConfirmPhone: () => void;
  handleCloseModal: () => void;
}

export const usePhoneStep = ({ next, onPhoneConfirmed }: UsePhoneStepProps): UsePhoneStepReturn => {
  const [isPhoneValid, setIsPhoneValid] = useState<boolean>(false);
  const [isPhoneFilled, setIsPhoneFilled] = useState<boolean>(false);
  const [phoneValue, setPhoneValue] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleValidationChange = useCallback((isValid: boolean, isFilled: boolean) => {
    setIsPhoneValid(isValid);
    setIsPhoneFilled(isFilled);
  }, []);

  const handlePhoneChange = useCallback((value: string) => {
    setPhoneValue(value);
  }, []);

  const handleNextClick = useCallback(() => {
    if (isPhoneValid && isPhoneFilled) { // Проверяем напрямую
      setIsModalOpen(true);
    }
  }, [isPhoneValid, isPhoneFilled]);

  const handleConfirmPhone = useCallback(() => {
    setIsModalOpen(false);
    onPhoneConfirmed(phoneValue);
    next();
  }, [next, onPhoneConfirmed, phoneValue]);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const isButtonEnabled = isPhoneFilled && isPhoneValid;

  return {
    phoneValue,
    isButtonEnabled,
    isModalOpen,
    handleValidationChange,
    handlePhoneChange,
    handleNextClick,
    handleConfirmPhone,
    handleCloseModal,
  };
};