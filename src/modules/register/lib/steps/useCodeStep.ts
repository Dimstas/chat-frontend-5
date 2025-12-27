import { useCallback, useEffect, useState } from 'react';
import { GetTokenPayload } from 'shared/api/auth.api';
import { useGetAuthToken } from 'shared/query/auth.query';

type UseCodeStepProps = {
  next: () => void;
  phone: string;
};

type UseCodeStepReturn = {
  code: string[];
  error: string | undefined;
  timeLeft: number;
  isTimerActive: boolean;
  isCodeComplete: boolean;
  isSubmitting: boolean;
  handleCodeChange: (newCode: string[]) => void;
  handleResendCode: () => void;
};

export const useCodeStep = ({ next, phone }: UseCodeStepProps): UseCodeStepReturn => {
  const [code, setCode] = useState<string[]>(['', '', '', '', '']);
  const [error, setError] = useState<string | undefined>(undefined);

  const [timeLeft, setTimeLeft] = useState<number>(56);
  const [isTimerActive, setIsTimerActive] = useState<boolean>(true);

  useEffect(() => {
    let timerId: NodeJS.Timeout;

    if (isTimerActive && timeLeft > 0) {
      timerId = setInterval(() => {
        setTimeLeft((prevTime) => {
          const newTime = prevTime - 1;
          if (newTime === 0) {
            clearInterval(timerId);
            setIsTimerActive(false);
            return newTime;
          }
          return newTime;
        });
      }, 1000);
    }

    return (): void => {
      if (timerId) {
        clearInterval(timerId);
      }
    };
  }, [isTimerActive, timeLeft]);

  const handleResendCode = (): void => {
    console.log('Отправляем новый код...');
    setTimeLeft(56);
    setIsTimerActive(true);
  };

  const { mutate: getAuthToken, isPending: isTokenRequestPending, error: tokenRequestError } = useGetAuthToken();

  const isCodeComplete = code.every((digit) => digit !== '');

  useEffect(() => {
    if (isCodeComplete) {
      const payload: GetTokenPayload = {
        phone_number: phone,
        code: code.join(''),
      };

      console.log('Отправляемый код:', code.join(''), 'номер:', phone);

      getAuthToken(payload, {
        onSuccess: (data) => {
          console.log('Токены получены, is_filled:', data.is_filled);
          next();
        },
        onError: (error) => {
          console.error('Ошибка при получении токена:', error);
          setError('Неверный код');

          setCode(['', '', '', '', '']);
        },
      });
    }
  }, [isCodeComplete, phone, code, getAuthToken, next]);

  const handleCodeChange = useCallback(
    (newCode: string[]) => {
      setCode(newCode);
      if (error) {
        setError(undefined);
      }
    },
    [error],
  );

  return {
    code,
    error,
    timeLeft,
    isTimerActive,
    isCodeComplete,
    isSubmitting: isTokenRequestPending,
    handleCodeChange,
    handleResendCode,
  };
};
