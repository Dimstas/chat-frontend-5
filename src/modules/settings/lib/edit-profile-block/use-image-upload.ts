import { useState, useRef, useCallback } from 'react';

type UseImageUploadReturn = {
  selectedFile: File | null;
  previewUrl: string | null;
  error: string | null;
  isUploading: boolean;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  triggerFileSelect: () => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
};

export const useImageUpload = (): UseImageUploadReturn => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const triggerFileSelect = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null); 

    const file = e.target.files?.[0] || null;

    if (!file) {
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }

    if (!file.type.startsWith('image/')) {
      setError('Пожалуйста, выберите изображение.');
      setSelectedFile(null);
      setPreviewUrl(null);
      if (e.target) e.target.value = '';
      return;
    }

    const maxSizeInBytes = 5 * 1024 * 1024; // 5 MB
    if (file.size > maxSizeInBytes) {
      setError('Размер файла превышает 5 МБ.');
      setSelectedFile(null);
      setPreviewUrl(null);
      if (e.target) e.target.value = '';
      return;
    }

    setSelectedFile(file);

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

  }, []);

  return {
    selectedFile,
    previewUrl,
    error,
    isUploading,
    handleFileChange,
    triggerFileSelect,
    fileInputRef,
  };
};