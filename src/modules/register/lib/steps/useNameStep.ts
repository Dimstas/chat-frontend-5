import { useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { checkUniqueName } from 'shared/api/auth.api';
import { validateName, validateLogin } from '../text-input/text-validation-schema';

interface UseNameStepProps {
  next: () => void;
}

interface UseNameStepReturn {
  firstName: string;
  login: string;
  firstNameError: string | undefined;
  loginError: string | undefined;
  isFormValid: boolean;
  isSubmitting: boolean;
  handleFirstNameChange: (value: string) => void;
  handleLoginChange: (value: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
}

export const useNameStep = ({ next }: UseNameStepProps): UseNameStepReturn => {
  const [firstName, setFirstName] = useState<string>('');
  const [login, setLogin] = useState<string>('');
  const [firstNameError, setFirstNameError] = useState<string | undefined>(undefined);
  const [loginError, setLoginError] = useState<string | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const queryClient = useQueryClient();

  const handleFirstNameChange = useCallback((value: string) => {
    setFirstName(value);
    if (value !== '') {
      const validation = validateName(value);
      if (!validation.isValid) {
        setFirstNameError(validation.error);
      } else {
        setFirstNameError(undefined);
      }
    } else {
      setFirstNameError(undefined);
    }
  }, []);

  const handleLoginChange = useCallback((value: string) => {
    setLogin(value);
    setLoginError(undefined);
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      setFirstNameError(undefined);
      setLoginError(undefined);

      let hasErrors = false;

      if (firstName.trim() === '') {
        setFirstNameError('Обязательное поле');
        hasErrors = true;
      } else {
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
        const loginValidation = validateLogin(login);
        if (!loginValidation.isValid) {
          setLoginError(loginValidation.error);
          hasErrors = true;
        }
      }

      if (hasErrors) {
        return;
      }

      const data = await queryClient.fetchQuery({
        queryKey: ['unique-name-check', login],
        queryFn: () => checkUniqueName(login),
        staleTime: 5 * 60 * 1000,
      });

      if (!data.is_unique) {
        setLoginError("Такой никнейм уже занят.");
        return;
      }

      next();

    } catch (error) {
      console.error("Ошибка при проверке уникальности:", error);
      if (error instanceof Response) {
        try {
          const errorText = await error.text();
          console.error("Тело ошибки от бэкенда:", errorText);
        } catch (e) {
          console.error("Не удалось прочитать тело ошибки:", e);
        }
      }
      setLoginError("Ошибка проверки. Попробуйте позже.");
    } finally {
      setIsSubmitting(false);
    }
  }, [firstName, login, next, queryClient]);

  const isFormValid = firstName.trim() !== '' && login.trim() !== '' && !firstNameError && !loginError;

  return {
    firstName,
    login,
    firstNameError,
    loginError,
    isFormValid,
    isSubmitting,
    handleFirstNameChange,
    handleLoginChange,
    handleSubmit,
  };
};