import Image from 'next/image';
import { JSX, useEffect, useRef, useState } from 'react';
import { CodeInput } from './codeInput/CodeInput';
import styles from './CodeStep.module.scss';

type CodeStepProps = {
  next: () => void;
  prev: () => void;
  phone: string;
};

export const CodeStep: React.FC<CodeStepProps> = ({ next, prev, phone }: CodeStepProps): JSX.Element => {
  const [code, setCode] = useState<string[]>(['', '', '', '', '']);
  const [error, setError] = useState<string | undefined>(undefined);
  const [timeLeft, setTimeLeft] = useState<number>(56);

  useEffect(() => {
    let timerId: ReturnType<typeof setInterval> | null = null;

    if (timeLeft > 0) {
      timerId = setInterval((): void => {
        setTimeLeft((prevTime) => {
          const newTime = prevTime - 1;
          if (newTime <= 0) {
            if (timerId) {
              clearInterval(timerId);
              timerId = null;
            }
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
  }, [timeLeft]); // Зависимость: timeLeft

  const handleResendCode = (): void => {
    console.log('Отправляем новый код...');
    setTimeLeft(56);
  };

  const autoProceedTimerRef = useRef<NodeJS.Timeout | null>(null);

  const isCodeComplete = code.every((digit) => digit !== '');

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

  const handleCodeChange = (newCode: string[]): void => {
    setCode(newCode);
    if (error) {
      setError(undefined);
    }
  };

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    const codeString = code.join('');
    if (codeString.length === 5) {
      if (/^\d{5}$/.test(codeString)) {
      } else {
        setError('Некорректный код');
      }
    } else {
      setError('Пожалуйста, введите 5 цифр');
    }
  };

  const isTimerActive = timeLeft > 0;

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <button className={styles.arrowButton} onClick={prev}></button>
          <Image
            src="/images/register/welcomeLogo.png"
            alt="Добро пожаловать"
            width={70}
            height={70}
            className={styles.image}
          />
        </div>
        <h1 className={styles.title}>Подтвердите вход</h1>

        <p className={styles.phoneText}>
          Код подтверждения отправлен <br /> на следующий номер: <br /> <strong>{phone}</strong>
        </p>

        <form onSubmit={handleSubmit} className={styles.codeForm}>
          <CodeInput label="Введите код" value={code} onChange={handleCodeChange} error={error} />
          {isTimerActive ? (
            <p className={styles.timerText}>
              Отправить новый код через {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
            </p>
          ) : (
            <button type="button" className={styles.resendButton} onClick={handleResendCode}>
              Отправить новый код
            </button>
          )}
          <button
            type="submit"
            className={`${styles.supportButton} ${isCodeComplete ? styles.active : ''}`}
            disabled={!isCodeComplete}
          >
            Не приходит код?
          </button>
        </form>
      </div>
    </div>
  );
};
