'use client';
import clsx from 'clsx';
import Image from 'next/image';
import { JSX, useEffect, useRef, useState } from 'react';
import Img from '../icons/image.svg';
import styles from './context-menu-attach-file.module.scss';
import type { Attachment, ContextMenuAttachFileProps } from './context-menu-attach-file.props';
const URL_ICON = '/images/messages-chats/file.png';

export const ContextMenuAttachFile = ({
  contextMenuPos,
  handleCloseMenu,
}: ContextMenuAttachFileProps): JSX.Element | null => {
  const maxSize = 25 * 1024 * 1024; // в байтах, по умолчанию 25MB
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  //const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  // Очистка URL объектов при размонтировании
  useEffect(() => {
    return (): void => {
      attachments.forEach((att) => URL.revokeObjectURL(att.preview));
    };
  }, [attachments]);

  const validateFile = (file: File): boolean => {
    // Проверка размера
    if (file.size > maxSize) {
      setError(`Файл "${file.name}" превышает ${maxSize / 1024 / 1024}MB`);
      return false;
    }

    // Для изображений дополнительная валидация
    if (file.type.startsWith('image/')) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        setError('Поддерживаются только JPEG, PNG, GIF и WEBP изображения');
        return false;
      }
    }
    return true;
  };

  const processFiles = (files: FileList | null): void => {
    if (!files) return;
    setError(null);
    const newAttachments: Attachment[] = [];

    Array.from(files).forEach((file) => {
      if (!validateFile(file)) return;

      // Проверка на дубликаты
      if (attachments.some((att) => att.file.name === file.name && att.file.size === file.size)) {
        setError(`Файл "${file.name}" уже добавлен`);
        return;
      }
      const AttachmentsId = crypto.randomUUID();
      newAttachments.push({
        id: AttachmentsId,
        file: file,
        preview: URL.createObjectURL(file),
        type: file.type.startsWith('image/') ? 'image' : 'file',
      });
    });

    const updated = [...attachments, ...newAttachments];
    setAttachments(updated);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>): void => {
    processFiles(e.target.files);
    // Сброс input, чтобы можно было выбрать те же файлы снова
    e.target.value = '';
  };

  const handleRemoveAttachment = (id: string): void => {
    setAttachments((prev) => {
      const removed = prev.find((att) => att.id === id);
      if (removed) URL.revokeObjectURL(removed.preview);
      const updated = prev.filter((att) => att.id !== id);
      setAttachments(updated);
      return updated;
    });
  };

  const triggerFileInput = (): void => {
    fileInputRef.current?.click();
    handleCloseMenu();
  };

  const triggerImageInput = (): void => {
    imageInputRef.current?.click();
    handleCloseMenu();
  };

  return (
    <div
      className={styles.frame}
      onMouseLeave={handleCloseMenu}
      style={{ top: contextMenuPos.y, left: contextMenuPos.x }}
    >
      <div className={styles.wrapper}>
        <button className={clsx(styles.cell, styles.cellTop)} onClick={triggerImageInput}>
          <div className={styles.text}>Выбрать изображение</div>
          <div className={styles.icon}>
            <Img />
          </div>
        </button>
        <button className={clsx(styles.cell, styles.cellBottom)} onClick={triggerFileInput}>
          <div className={styles.text}>Выбрать файл</div>
          <div className={styles.icon}>
            <Image src={URL_ICON} width={17} height={17} alt="иконка" />
          </div>
        </button>

        {/* Скрытые input'ы */}
        <input
          ref={imageInputRef}
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          multiple
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
        <input ref={fileInputRef} type="file" multiple onChange={handleFileSelect} style={{ display: 'none' }} />
      </div>
    </div>
  );
};
