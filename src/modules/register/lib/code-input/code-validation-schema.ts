// src/shared/lib/code-input/code-validation-schema.ts
import { z } from 'zod';

// Схема для одного символа кода (цифра)
const codeDigitSchema = z.string().regex(/^\d?$/, 'Должна быть цифрой');

// Схема для всего кода (массив из 5 строк)
export const codeSchema = z.array(codeDigitSchema).length(5, 'Код должен состоять из 5 символов');

// Функция для проверки, является ли массив кода валидным
export const validateCodeArray = (codeArray: string[]): boolean => {
  try {
    codeSchema.parse(codeArray);
    return true;
  } catch (error) {
    return false;
  }
};

// Функция для проверки, заполнен ли код (все 5 полей)
export const isCodeComplete = (codeArray: string[]): boolean => {
  return codeArray.every(digit => digit !== '');
};