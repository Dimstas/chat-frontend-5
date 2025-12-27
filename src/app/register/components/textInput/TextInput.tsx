import { ChangeEvent, JSX, useState } from 'react';
import styles from './TextInput.module.scss';

type TextInputProps = {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
  maxLength?: number;
  validate?: (value: string) => string | null;
};

export const TextInput = ({
  label,
  placeholder = '',
  value,
  onChange,
  error,
  disabled = false,
  maxLength = 30,
  validate,
}: TextInputProps): JSX.Element => {
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    let inputValue = e.target.value;
    if (inputValue.length > maxLength) {
      inputValue = inputValue.slice(0, maxLength);
    }
    onChange(inputValue);

    if (validate) {
      validate(inputValue);
    }
  };

  const handleBlur = (): void => {
    setIsFocused(false);
    if (validate && value.trim() !== '') {
      validate(value);
    }
  };

  const handleFocus = (): void => {
    setIsFocused(true);
  };

  let errorMessage = error;
  if (!errorMessage && value.trim() !== '') {
    if (!/^[a-zA-Zа-яА-ЯёЁ\s\-]+$/.test(value)) {
      errorMessage = 'Используйте только буквы, пробел или тире';
    } else if (value.length > maxLength) {
      errorMessage = `Не более ${maxLength} символов`;
    }
  }

  return (
    <div className={styles.container}>
      {label && <label className={styles.label}>{label}</label>}
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={`${styles.textInput} ${
          isFocused ? styles.focused : ''
        } ${errorMessage ? styles.error : ''} ${disabled ? styles.disabled : ''}`}
        maxLength={maxLength}
        disabled={disabled}
        aria-label={label || placeholder}
      />
      {errorMessage && <span className={styles.errorMessage}>{errorMessage}</span>}
    </div>
  );
};
