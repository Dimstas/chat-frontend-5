import { ChangeEvent, FocusEvent, JSX, KeyboardEvent, useState } from 'react';
import styles from './CodeInput.module.scss';

type CodeInputProps = {
  label?: string;
  value: string[];
  onChange: (value: string[]) => void;
  error?: string;
  disabled?: boolean;
};

export const CodeInput: React.FC<CodeInputProps> = ({
  label,
  value,
  onChange,
  error,
  disabled = false,
}: CodeInputProps): JSX.Element => {
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  const handleChange =
    (index: number) =>
    (e: ChangeEvent<HTMLInputElement>): void => {
      if (disabled) return;

      const inputValue = e.target.value;
      const digit = inputValue.slice(0, 1);

      const newCode = [...value];
      newCode[index] = digit;
      onChange(newCode);

      if (digit && index < 4) {
        const nextInput = document.getElementById(`code-input-${index + 1}`);
        if (nextInput) {
          nextInput.focus();
        }
      }
    };

  const handleBlur = () => (): void => {
    if (disabled) return;
    setFocusedIndex(null);
  };

  const handleFocus =
    (index: number) =>
    (e: FocusEvent<HTMLInputElement>): void => {
      if (disabled) return;
      setFocusedIndex(index);
      e.target.select();
    };

  const handleKeyDown =
    (index: number) =>
    (e: KeyboardEvent<HTMLInputElement>): void => {
      if (disabled) return;

      if (e.key === 'Backspace' || e.key === 'Delete') {
        if (value[index] === '' && index > 0) {
          const prevInput = document.getElementById(`code-input-${index - 1}`);
          if (prevInput) {
            prevInput.focus();
          }
        } else if (value[index] !== '') {
          const newCode = [...value];
          newCode[index] = '';
          onChange(newCode);
        }
      } else if (e.key === 'ArrowLeft' && index > 0) {
        const prevInput = document.getElementById(`code-input-${index - 1}`);
        if (prevInput) {
          prevInput.focus();
        }
      } else if (e.key === 'ArrowRight' && index < 4) {
        const nextInput = document.getElementById(`code-input-${index + 1}`);
        if (nextInput) {
          nextInput.focus();
        }
      }
    };

  return (
    <div className={styles.container}>
      {label && <label className={styles.label}>{label}</label>}
      <div className={styles.inputsWrapper}>
        {value.map((digit, index) => (
          <input
            key={index}
            id={`code-input-${index}`}
            type="text"
            inputMode="numeric"
            pattern="\d*"
            maxLength={1}
            value={digit}
            onChange={handleChange(index)}
            onFocus={handleFocus(index)}
            onBlur={handleBlur()}
            onKeyDown={handleKeyDown(index)}
            className={`${styles.codeInput} ${
              focusedIndex === index ? styles.focused : ''
            } ${error ? styles.error : ''} ${disabled ? styles.disabled : ''}`}
            placeholder="0"
            autoComplete="off"
            disabled={disabled}
            aria-label={`Цифра ${index + 1} кода`}
          />
        ))}
      </div>
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
};
