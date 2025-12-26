import { z } from 'zod';

// Определяем схему Zod для валидации номера телефона
// Ожидаем формат: +7 (XXX) XXX-XX-XX или 8 XXX XXX-XX-XX
export const phoneSchema = z
  .string()
  .regex(
    /^(8|\+7)\s?\d{3}\s?\d{3}\s?\d{2}\s?\d{2}$/,
    'Некорректный номер'
  );

// Функция для проверки, является ли строка валидным номером
export const validatePhoneString = (inputValue: string): boolean => {
  try {
    phoneSchema.parse(inputValue);
    return true;
  } catch (error) {
    return false;
  }
};