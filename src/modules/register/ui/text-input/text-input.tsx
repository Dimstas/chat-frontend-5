// src/shared/ui/text-input/text-input.tsx
import { JSX } from 'react';
import { useTextInputLogic } from '../../lib/text-input/use-text-input-logic'; // Импортируем хук
import styles from './text-input.module.scss';

type TextInputProps = {
  label?: string;
  placeholder?: string;
  value: string; // Текущее значение
  onChange: (value: string) => void; // Функция для обновления значения
  error?: string; // Сообщение об ошибке - УПРАВЛЯЕТСЯ ИЗВНЕ
  disabled?: boolean;
  maxLength?: number;
};

export const TextInput = ({
  label,
  placeholder = '',
  value,
  onChange,
  error, // Ошибка приходит извне
  disabled = false,
  maxLength = 30,
}: TextInputProps): JSX.Element => {
  // Вызываем хук и получаем только логику ввода
  const {
    isFocused,
    handleChange,
    handleFocus,
    handleBlur,
  } = useTextInputLogic({ value, onChange, disabled, maxLength });

  // errorMessage теперь приходит только как пропс 'error'
  const errorMessage = error;

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