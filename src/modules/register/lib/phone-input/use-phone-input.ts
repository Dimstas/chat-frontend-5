import { useState, ChangeEvent, FocusEvent } from 'react';
import { validatePhoneString } from './phone-validation-schema';
import { usePhoneFormatting } from './use-phone-formatting';

interface UsePhoneInputReturn {
  value: string;
  error: string | null;
  isFocused: boolean;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleFocus: () => void;
  handleBlur: (e: FocusEvent<HTMLInputElement>) => void;
  formattedValue: string;
  isValid: boolean;
  isFilled: boolean;
}

interface UsePhoneInputOptions {
  onChange?: (value: string) => void;
  onValidationChange?: (isValid: boolean, isFilled: boolean) => void;
}

export const usePhoneInput = (options: UsePhoneInputOptions = {}): UsePhoneInputReturn => {
  const { onChange, onValidationChange } = options;
  const [internalValue, setInternalValue] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const formatPhone = usePhoneFormatting();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    if (inputValue.startsWith('+') && !inputValue.startsWith('+7')) {
      setInternalValue(inputValue);
      onChange?.(inputValue);
      return;
    }

    const formattedValue = formatPhone(inputValue);
    setInternalValue(formattedValue);
    onChange?.(formattedValue);

    if (error) {
      setError(null);
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    const inputValue = e.target.value;
    let newError: string | null = null;
    let isValid = false;
    const isFilled = inputValue.trim() !== '';

    if (isFilled) {
      if (!validatePhoneString(inputValue)) {
        newError = 'Некорректный номер';
      } else {
        isValid = true;
      }
    }
    setError(newError);

    onValidationChange?.(isValid, isFilled);
  };

  const formattedValue = formatPhone(internalValue);
  const isValid = validatePhoneString(internalValue);
  const isFilled = internalValue.trim() !== '';

  return {
    value: internalValue,
    error,
    isFocused,
    handleChange,
    handleFocus,
    handleBlur,
    formattedValue,
    isValid,
    isFilled,
  };
};