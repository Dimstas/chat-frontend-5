import React, { JSX } from 'react';
import { ButtonUI } from '../button';
import styles from './modal.module.scss';

/**
 * Компонент модального окна для отображения информации, подтверждения действий или ввода данных.
 * Поддерживает заголовок, контент и две опциональные кнопки с обработчиками.
 *
 * @param props.title Заголовок модального окна (опционально).
 * @param props.content Основной текст или контент внутри модального окна.
 * @param props.firstButtonText Текст для первой кнопки
 * @param props.secondButtonText Текст для второй кнопки
 * @param props.onFirstButtonClick Обработчик клика по первой кнопке (опционально).
 * @param props.onSecondButtonClick Обработчик клика по второй кнопке (опционально).
 * @param props.onClose Обработчик закрытия модального окна.
 *
 * @example
 * <Modal
 *   title="Подтверждение действия"
 *   content="Вы уверены, что хотите удалить этот элемент?"
 *   firstButtonText="Удалить"
 *   secondButtonText="Отмена"
 *   onFirstButtonClick={handleDelete}
 *   onSecondButtonClick={handleCancel}
 *   onClose={handleClose}
 * />
 *
 * @return {JSX.Element}
 */

type ModalProps = {
  title?: string;
  content: string;
  firstButtonText?: string;
  secondButtonText?: string;
  onFirstButtonClick?: () => void;
  onSecondButtonClick?: () => void;
  onClose: () => void;
};

export const Modal: React.FC<ModalProps> = ({
  title,
  content,
  firstButtonText,
  secondButtonText,
  onFirstButtonClick,
  onSecondButtonClick,
  onClose,
}): JSX.Element => {
  const handleBackdropClick = (e: React.MouseEvent): void => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div className={styles.modal} role="dialog" aria-modal="true" aria-labelledby={title ? 'modal-title' : undefined}>
        {title && (
          <div id="modal-title" className={styles.title}>
            {title}
          </div>
        )}

        {/* контент */}
        <p className={styles.content}>{content}</p>

        {/* Кнопки */}
        <div className={styles.buttonContainer}>
          {secondButtonText && (
            <ButtonUI
              variant="modal"
              appearance="secondary"
              label={secondButtonText}
              onClick={() => {
                if (onSecondButtonClick) onSecondButtonClick();
              }}
            />
          )}

          {firstButtonText && (
            <ButtonUI
              variant="modal"
              appearance="primary"
              label={firstButtonText}
              onClick={() => {
                if (onFirstButtonClick) onFirstButtonClick();
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};
