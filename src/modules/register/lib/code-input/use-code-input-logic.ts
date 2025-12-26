// src/shared/lib/code-input/use-code-input-logic.ts
import { useState, ChangeEvent, FocusEvent, KeyboardEvent } from 'react';
import { validateCodeArray } from './code-validation-schema';

// Тип для возвращаемого значения хука
interface UseCodeInputLogicReturn {
  focusedIndex: number | null;
  handleChange: (index: number) => (e: ChangeEvent<HTMLInputElement>) => void;
  handleFocus: (index: number) => (e: FocusEvent<HTMLInputElement>) => void;
  handleBlur: () => () => void;
  handleKeyDown: (index: number) => (e: KeyboardEvent<HTMLInputElement>) => void;
  isValid: boolean; // Добавим поле для проверки валидности
  isComplete: boolean; // Добавим поле для проверки заполненности
}

// Тип для опций хука
interface UseCodeInputLogicOptions {
  value: string[]; // Текущее значение кода
  onChange: (value: string[]) => void; // Функция для обновления значения
  disabled?: boolean; // Состояние disabled
}

export const useCodeInputLogic = (options: UseCodeInputLogicOptions): UseCodeInputLogicReturn => {
  const { value, onChange, disabled = false } = options;
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  // Проверяем валидность и заполненность при каждом рендере (или при изменении value)
  const isValid = validateCodeArray(value);
  const isComplete = value.every(digit => digit !== '');

  const handleChange = (index: number) => (e: ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;

    const inputValue = e.target.value;
    // Берём только первую цифру, если ввели больше
    const digit = inputValue.replace(/\D/g, '').slice(0, 1);

    const newCode = [...value];
    newCode[index] = digit;
    onChange(newCode);

    // Переходим к следующему полю, если ввели цифру и это не последнее поле
    if (digit && index < 4) {
      const nextInput = document.getElementById(`code-input-${index + 1}`);
      if (nextInput) {
        nextInput.focus();
      }
    }
  };

  const handleFocus = (index: number) => (e: FocusEvent<HTMLInputElement>) => {
    if (disabled) return;
    setFocusedIndex(index);
    e.target.select(); // Выделяем текст при фокусе
  };

  const handleBlur = () => () => {
    if (disabled) return;
    setFocusedIndex(null);
  };

  const handleKeyDown = (index: number) => (e: KeyboardEvent<HTMLInputElement>) => {
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

  return {
    focusedIndex,
    handleChange,
    handleFocus,
    handleBlur,
    handleKeyDown,
    isValid,
    isComplete,
  };
};