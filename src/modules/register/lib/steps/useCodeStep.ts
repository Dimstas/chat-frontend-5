import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { GetTokenPayload } from 'shared/api/auth.api';
import { useGetAuthToken } from 'shared/query/auth.query';

type UseCodeStepProps = {
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

export const useCodeStep = ({ phone }: UseCodeStepProps): UseCodeStepReturn => {
  const [code, setCode] = useState<string[]>(['', '', '', '', '']);
  const [error, setError] = useState<string | undefined>(undefined);
  const [attemptsLeft, setAttemptsLeft] = useState<number>(5);

  const [timeLeft, setTimeLeft] = useState<number>(56);
  const [isTimerActive, setIsTimerActive] = useState<boolean>(true);
  const router = useRouter();

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
          if (!data.is_filled) router.push('/register/user');
          else router.push('/contacts');
        },
        onError: () => {
          const newAttempts = attemptsLeft - 1;
          setAttemptsLeft(newAttempts);
          setError(`Код введен неверно. Осталось попыток: ${newAttempts}`);

          setCode(['', '', '', '', '']);
        },
      });
    }
  }, [isCodeComplete, phone, code, getAuthToken]);

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
