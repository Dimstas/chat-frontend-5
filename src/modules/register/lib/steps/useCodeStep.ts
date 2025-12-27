import { useState, useEffect, useCallback } from 'react';
import { useGetAuthToken } from 'shared/query/auth.query';
import { GetTokenPayload } from 'shared/api/auth.api';

interface UseCodeStepProps {
  next: () => void;
  phone: string;
}

interface UseCodeStepReturn {
  code: string[];
  error: string | undefined;
  timeLeft: number;
  isTimerActive: boolean;
  isCodeComplete: boolean;
  isSubmitting: boolean;
  handleCodeChange: (newCode: string[]) => void;
  handleResendCode: () => void;
}

export const useCodeStep = ({ next, phone }: UseCodeStepProps): UseCodeStepReturn => {
  const [code, setCode] = useState<string[]>(['', '', '', '', '']);
  const [error, setError] = useState<string | undefined>(undefined);

  const [timeLeft, setTimeLeft] = useState<number>(56);
  const [isTimerActive, setIsTimerActive] = useState<boolean>(true);

  useEffect(() => {
    let timerId: ReturnType<typeof setInterval>;

    if (isTimerActive && timeLeft > 0) {
      timerId = setInterval(() => {
        setTimeLeft(prevTime => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsTimerActive(false);
    }

    return () => clearInterval(timerId);
  }, [isTimerActive, timeLeft]);

  const handleResendCode = () => {
    console.log("Отправляем новый код...");
    setTimeLeft(56);
    setIsTimerActive(true);
  };

  const { mutate: getAuthToken, isPending: isTokenRequestPending, error: tokenRequestError } = useGetAuthToken();

  const isCodeComplete = code.every(digit => digit !== '');

  useEffect(() => {
    if (isCodeComplete) {
      const payload: GetTokenPayload = {
        phone_number: phone,
        code: code.join(''),
      };

      console.log("Отправляемый код:", code.join(''), "номер:", phone);

      getAuthToken(payload, {
        onSuccess: (data) => {
          console.log("Токены получены, is_filled:", data.is_filled);
          next();
        },
        onError: (error) => {
          console.error("Ошибка при получении токена:", error);
          setError("Неверный код");
          
          setCode(['', '', '', '', '']);
        },
      });
    }
  }, [isCodeComplete, phone, code, getAuthToken, next]);

  const handleCodeChange = useCallback((newCode: string[]) => {
    setCode(newCode);
    if (error) {
      setError(undefined);
    }
  }, [error]);

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