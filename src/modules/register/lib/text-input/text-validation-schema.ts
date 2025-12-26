// src/shared/lib/text-input/text-validation-schema.ts
import { z } from 'zod';

// Схема для имени: максимум 30 символов, только буквы, пробел, тире
// Убираем .min(1, ...) - пустая строка допустима по схеме
export const nameSchema = z
  .string()
  .max(30, 'Не более 30 символов')
  .regex(/^[a-zA-Zа-яА-ЯёЁ\s\-]*$/, 'Используйте только буквы, пробел или тире'); // * означает 0 или более

// Схема для логина: максимум 30 символов, только буквы, цифры, _
// Убираем .min(1, ...) - пустая строка допустима по схеме
export const loginSchema = z
  .string()
  .max(30, 'Не более 30 символов')
  .regex(/^[a-zA-Zа-яА-ЯёЁ0-9_]*$/, 'Используйте только буквы, цифры и _'); // * означает 0 или более

// Функция для валидации имени
// Возвращает isValid: true, если строка пустая, независимо от других ошибок
export const validateName = (value: string): { isValid: boolean; error?: string } => {
  if (value === '') {
    // Пустая строка всегда валидна с точки зрения других правил (длина, символы)
    // Ошибка "Обязательное поле" будет обрабатываться отдельно
    return { isValid: true };
  }

  try {
    nameSchema.parse(value);
    return { isValid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      if (error.errors && error.errors.length > 0) {
        return { isValid: false, error: error.errors[0].message };
      } else {
        return { isValid: false, error: 'Ошибка валидации имени' };
      }
    }
    return { isValid: false, error: 'Неизвестная ошибка валидации имени' };
  }
};

// Функция для валидации логина
// Возвращает isValid: true, если строка пустая, независимо от других ошибок
export const validateLogin = (value: string): { isValid: boolean; error?: string } => {
  if (value === '') {
    // Пустая строка всегда валидна с точки зрения других правил (длина, символы)
    // Ошибка "Обязательное поле" будет обрабатываться отдельно
    return { isValid: true };
  }

  try {
    loginSchema.parse(value);
    return { isValid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      if (error.errors && error.errors.length > 0) {
        return { isValid: false, error: error.errors[0].message };
      } else {
        return { isValid: false, error: 'Ошибка валидации логина' };
      }
    }
    return { isValid: false, error: 'Неизвестная ошибка валидации логина' };
  }
};