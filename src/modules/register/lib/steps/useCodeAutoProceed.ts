// src/modules/register/model/useCodeAutoProceed.ts
import { useEffect, useRef } from 'react';

interface UseCodeAutoProceedProps {
  isCodeComplete: boolean;
  next: () => void;
}

export const useCodeAutoProceed = ({ isCodeComplete, next }: UseCodeAutoProceedProps): void => {
  const autoProceedTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isCodeComplete) {
      const timer = setTimeout((): void => {
        console.log('Код заполнен, автоматический переход через 2 секунды...');
        next();
      }, 2000);

      autoProceedTimerRef.current = timer;
    } else {
      if (autoProceedTimerRef.current) {
        clearTimeout(autoProceedTimerRef.current);
        autoProceedTimerRef.current = null;
      }
    }

    return (): void => {
      if (autoProceedTimerRef.current) {
        clearTimeout(autoProceedTimerRef.current);
      }
    };
  }, [isCodeComplete, next]);
};