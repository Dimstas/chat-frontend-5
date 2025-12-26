// src/modules/register/ui/code-step/code-step.tsx
import Image from 'next/image';
import { JSX, useState } from 'react';
import { CodeInput } from '../code-input'; // Обновите путь
import { useCodeTimer } from '../../lib/steps/useCodeTimer';
import { useCodeAutoProceed } from '../../lib/steps/useCodeAutoProceed';
import styles from './code-step.module.scss';

type CodeStepProps = {
  next: () => void;
  prev: () => void;
  phone: string;
};

export const CodeStep: React.FC<CodeStepProps> = ({ next, prev, phone }: CodeStepProps): JSX.Element => {
  const [code, setCode] = useState<string[]>(['', '', '', '', '']);
  const [error, setError] = useState<string | undefined>(undefined);

  // Используем хук для таймера
  const { timeLeft, isTimerActive, handleResendCode } = useCodeTimer(56);

  // Проверка, заполнены ли все поля
  const isCodeComplete = code.every((digit) => digit !== '');

  // Используем хук для автоматического перехода
  useCodeAutoProceed({ isCodeComplete, next });

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
        // next(); // Закомментировано, так как переход теперь происходит в useCodeAutoProceed
      } else {
        setError('Некорректный код');
      }
    } else {
      setError('Пожалуйста, введите 5 цифр');
    }
  };

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