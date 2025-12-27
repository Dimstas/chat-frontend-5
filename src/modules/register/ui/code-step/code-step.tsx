import Image from 'next/image';
import { JSX } from 'react';
import { useCodeStep } from '../../lib/steps/useCodeStep';
import { CodeInput } from '../code-input';
import styles from './code-step.module.scss';

type CodeStepProps = {
  next: () => void;
  prev: () => void;
  phone: string;
};

export const CodeStep: React.FC<CodeStepProps> = ({ next, prev, phone }: CodeStepProps): JSX.Element => {
  const { code, error, timeLeft, isTimerActive, isCodeComplete, handleCodeChange, handleResendCode } = useCodeStep({
    next,
    phone,
  });

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

        <form onSubmit={(e) => e.preventDefault()} className={styles.codeForm}>
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
