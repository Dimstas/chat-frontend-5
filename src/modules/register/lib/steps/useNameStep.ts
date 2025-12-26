// src/modules/register/model/useNameStep.ts
import { useState, useCallback } from 'react';
import { validateName, validateLogin } from '../text-input/text-validation-schema'; // Обновите путь, если нужно

interface UseNameStepProps {
  next: () => void;
}

interface UseNameStepReturn {
  firstName: string;
  login: string;
  firstNameError: string | undefined;
  loginError: string | undefined;
  isFormValid: boolean;
  handleFirstNameChange: (value: string) => void;
  handleLoginChange: (value: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
}

export const useNameStep = ({ next }: UseNameStepProps): UseNameStepReturn => {
  const [firstName, setFirstName] = useState<string>('');
  const [login, setLogin] = useState<string>('');
  const [firstNameError, setFirstNameError] = useState<string | undefined>(undefined);
  const [loginError, setLoginError] = useState<string | undefined>(undefined);

  const handleFirstNameChange = useCallback((value: string) => {
    setFirstName(value);
    // Валидируем только если не пусто (ошибка "Обязательное поле" будет при submit)
    if (value !== '') {
      const validation = validateName(value);
      if (!validation.isValid) {
        setFirstNameError(validation.error);
      } else {
        setFirstNameError(undefined); // Очищаем ошибку, если валидно
      }
    } else {
      // Если значение пустое, очищаем ошибку (до submit)
      setFirstNameError(undefined);
    }
  }, []);

  const handleLoginChange = useCallback((value: string) => {
    setLogin(value);
    // Валидируем только если не пусто (ошибка "Обязательное поле" будет при submit)
    if (value !== '') {
      const validation = validateLogin(value);
      if (!validation.isValid) {
        setLoginError(validation.error);
      } else {
        setLoginError(undefined); // Очищаем ошибку, если валидно
      }
    } else {
      // Если значение пустое, очищаем ошибку (до submit)
      setLoginError(undefined);
    }
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();

    // Сбрасываем ошибки перед проверкой
    setFirstNameError(undefined);
    setLoginError(undefined);

    let hasErrors = false;

    // Проверяем, пустые ли поля
    if (firstName.trim() === '') {
      setFirstNameError('Обязательное поле');
      hasErrors = true;
    } else {
      // Если поле не пустое, проверяем его валидность (хотя handleChange уже делает это)
      // Но на всякий случай, если что-то изменилось между onChange и onSubmit
      const nameValidation = validateName(firstName);
      if (!nameValidation.isValid) {
        setFirstNameError(nameValidation.error);
        hasErrors = true;
      }
    }

    if (login.trim() === '') {
      setLoginError('Обязательное поле');
      hasErrors = true;
    } else {
      // Если поле не пустое, проверяем его валидность (хотя handleChange уже делает это)
      const loginValidation = validateLogin(login);
      if (!loginValidation.isValid) {
        setLoginError(loginValidation.error);
        hasErrors = true;
      }
    }

    // Если ошибок нет, переходим дальше
    if (!hasErrors) {
      next();
    }
  }, [firstName, login, next]);

  // isFormValid теперь проверяет наличие ошибок (кроме "Обязательное поле", которая появляется при submit)
  // Но для кнопки disabled можно использовать предыдущую логику, чтобы не отправлять пустую форму
  const isFormValid = firstName.trim() !== '' && login.trim() !== '' && !firstNameError && !loginError;

  return {
    firstName,
    login,
    firstNameError,
    loginError,
    isFormValid,
    handleFirstNameChange,
    handleLoginChange,
    handleSubmit,
  };
};