// src/modules/register/model/useCodeTimer.ts
import { useState, useEffect } from 'react';

interface UseCodeTimerReturn {
  timeLeft: number;
  isTimerActive: boolean;
  handleResendCode: () => void;
}

export const useCodeTimer = (initialTime: number = 56): UseCodeTimerReturn => {
  const [timeLeft, setTimeLeft] = useState<number>(initialTime);

  useEffect(() => {
    let timerId: ReturnType<typeof setInterval> | null = null;

    if (timeLeft > 0) {
      timerId = setInterval((): void => {
        setTimeLeft((prevTime) => {
          const newTime = prevTime - 1;
          // clearInterval происходит при следующем запуске useEffect, если timeLeft <= 0
          return newTime;
        });
      }, 1000);
    }

    return (): void => {
      if (timerId) {
        clearInterval(timerId);
      }
    };
  }, [timeLeft]); // Зависимость: timeLeft

  const handleResendCode = (): void => {
    console.log('Отправляем новый код...');
    setTimeLeft(initialTime); // Сбрасываем таймер на начальное значение
  };

  const isTimerActive = timeLeft > 0;

  return { timeLeft, isTimerActive, handleResendCode };
};