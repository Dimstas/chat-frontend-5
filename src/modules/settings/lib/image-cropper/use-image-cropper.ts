// src/modules/settings/lib/image-cropper/use-image-cropper.ts
import { useCallback, useRef, useState } from 'react'; // Добавляем useEffect

type UseImageCropperReturn = {
  zoom: number;
  setZoom: (value: number) => void;
  previewUrl: string | null;
  originalFile: File | null;
  isDragging: boolean;
  setIsDragging: (value: boolean) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  reset: () => void;
  // fileInputRef: React.RefObject<HTMLInputElement>;
};

// Принимаем начальные значения
export const useImageCropper = (
  initialPreviewUrl: string | null = null,
  initialOriginalFile: File | null = null,
): UseImageCropperReturn => {
  const [zoom, setZoom] = useState<number>(100);
  // Используем initialPreviewUrl для начального состояния
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialPreviewUrl);
  // Используем initialOriginalFile для начального состояния
  const [originalFile, setOriginalFile] = useState<File | null>(initialOriginalFile);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Опционально: синхронизируем originalFile с previewUrl, если originalFile не предоставлен, но previewUrl есть
  // Но в данном случае, мы явно передаём оба, так что это может быть не нужно.
  // Если initialOriginalFile === null, но initialPreviewUrl !== null, то originalFile останется null.
  // Это может быть корректным поведением, если URL получен не из выбранного File.

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      console.error('Выбран не изображение');
      return;
    }

    const maxSizeInBytes = 5 * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      console.error('Размер файла превышает 5 МБ');
      return;
    }

    setOriginalFile(file);

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setZoom(100); // Сбрасываем zoom при новом файле
  }, []);

  const reset = useCallback(() => {
    setZoom(100);
    setPreviewUrl(null);
    setOriginalFile(null);
    setIsDragging(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, []);

  return {
    zoom,
    setZoom,
    previewUrl,
    originalFile,
    isDragging,
    setIsDragging,
    handleFileChange,
    reset,
    // fileInputRef,
  };
};
