import React, { JSX, useCallback, useEffect, useRef } from 'react';
import styles from './autosize-textarea.module.scss';
import type { AutosizeTextareaProps } from './autosize-textarea.props';

export const AutosizeTextarea = ({ maxHeight = 472, style, onInput, ...props }: AutosizeTextareaProps): JSX.Element => {
  const ref = useRef<HTMLTextAreaElement | null>(null);
  const resize = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    // сброс высоты чтобы правильно вычислить scrollHeight
    el.style.height = 'auto';
    const scrollHeight = el.scrollHeight;
    const newHeight = Math.min(scrollHeight, maxHeight);
    el.style.height = `${newHeight}px`;
    // при достижении maxHeight включаем вертикальную прокрутку, иначе скрываем полосу
    el.style.overflowY = scrollHeight > maxHeight ? 'auto' : 'hidden';
  }, [maxHeight]);

  useEffect(() => {
    resize(); // подгонка при монтировании/значениях по умолчанию
    // также подгоняем при ресайзе окна (опционально)
    window.addEventListener('resize', resize);
    return (): void => window.removeEventListener('resize', resize);
  }, [resize]);

  // вызываем resize при вводе — сохраняем возможность внешнего onInput
  const handleInput: React.FormEventHandler<HTMLTextAreaElement> = (e) => {
    resize();
    if (onInput) onInput(e);
  };
  useEffect(() => {
    resize();
  }, [props.value, resize]);

  return (
    <textarea
      className={styles.textarea}
      ref={ref}
      rows={1}
      style={{ resize: 'none', ...style }}
      onInput={handleInput}
      {...props}
    />
  );
};
