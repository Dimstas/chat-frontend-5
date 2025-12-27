import { ChangeEvent, FocusEvent, JSX, useState } from 'react';
import styles from './PhoneNumberInput.module.scss';

type PhoneNumberInputProps = {
  onChange?: (value: string) => void;
  onValidationChange?: (isValid: boolean, isFilled: boolean) => void;
};

const formatDigitsWithSpaces = (digits: string): string => {
  let formatted = '';
  let remaining = digits;
  const lengths = [3, 3, 2, 2];

  for (const length of lengths) {
    if (remaining.length > 0) {
      const part = remaining.substring(0, length);
      formatted += (formatted ? ' ' : '') + part;
      remaining = remaining.substring(length);
    }
  }

  return formatted;
};

export const PhoneNumberInput: React.FC<PhoneNumberInputProps> = ({
  onChange,
  onValidationChange,
}: PhoneNumberInputProps): JSX.Element => {
  const [value, setValue] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const validatePhone = (inputValue: string): boolean => {
    const digitsOnly = inputValue.replace(/\D/g, '');
    return /^(7|8)\d{10}$/.test(digitsOnly) && digitsOnly.length === 11;
  };

  const formatPhone = (inputValue: string): string => {
    const digitsOnly = inputValue.replace(/\D/g, '');
    let prefix = '';
    let digitsToFormat = '';

    if (digitsOnly.startsWith('8')) {
      prefix = '+7';
      digitsToFormat = digitsOnly.substring(1);
    } else if (digitsOnly.startsWith('7')) {
      prefix = '+7';
      digitsToFormat = digitsOnly.substring(1);
    } else if (digitsOnly.length > 0) {
      prefix = '';
      digitsToFormat = digitsOnly;
    }

    const formattedDigits = digitsToFormat ? formatDigitsWithSpaces(digitsToFormat) : '';

    return prefix + (formattedDigits ? ' ' + formattedDigits : '');
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const inputValue = e.target.value;
    if (inputValue.startsWith('+') && !inputValue.startsWith('+7')) {
      setValue(inputValue);
      return;
    }

    const formattedValue = formatPhone(inputValue);
    setValue(formattedValue);

    if (error) {
      setError(null);
    }

    onChange?.(formattedValue);
  };

  const handleFocus = (): void => {
    setIsFocused(true);
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement>): void => {
    setIsFocused(false);
    const inputValue = e.target.value;
    let newError: string | null = null;
    let isValid = false;
    const isFilled = inputValue.trim() !== '';

    if (isFilled) {
      if (!validatePhone(inputValue)) {
        newError = 'Некорректный номер';
      } else {
        isValid = true;
      }
    }
    setError(newError);

    onValidationChange?.(isValid, isFilled);
  };

  let labelText = 'Введите номер телефона';
  if (!isFocused) {
    if (value.trim() === '') {
      labelText = 'Введите номер телефона';
    } else if (error) {
      labelText = error;
    } else if (!error) {
      labelText = 'Измените номер';
    }
  }

  const placeholderText = '+7 900 000 00 00';

  return (
    <div className={styles.inputWrapper}>
      <label className={styles.label}>{labelText}</label>
      <input
        type="tel"
        placeholder={value ? '' : placeholderText}
        value={value}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={`${styles.phoneInput} ${error ? styles.error : ''}`}
      />
    </div>
  );
};
