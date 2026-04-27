'use client';
import { useRef, useState } from 'react';
import type { RestMessageApi } from '../model/messages-list';

type UseDownloadMessageFileReturn = {
  handleDownloadMessageFileClick: () => Promise<void>;
  handleStopDownloadMessageFileClick: () => void;
  isDownloading: boolean;
};

export const useDownloadMessageFile = (
  message: RestMessageApi & { status?: 'pending' | 'sent' | 'failed' | 'read' },
): UseDownloadMessageFileReturn => {
  const downloadControllerRef = useRef<AbortController | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadMessageFileClick = async (): Promise<void> => {
    // Если уже идёт загрузка — отменяем предыдущую
    if (downloadControllerRef.current) {
      downloadControllerRef.current.abort();
    }

    const controller = new AbortController();
    downloadControllerRef.current = controller;
    setIsDownloading(true);

    try {
      // Получаем объект файла
      const file = message.files_list[0] ?? message.forwarded_messages[0]?.files_list[0];
      if (!file) throw new Error('Файл не найден');

      // Очищаем URL от лишнего слеша
      const cleanUrl = file.file_url.replace(/\.(jpe?g|png|gif|webp)\/$/i, '.$1');
      const urlObj = new URL(cleanUrl);
      const pathAfterFirstSlash = urlObj.pathname.slice(1);
      const proxyUrl = `/api/proxy/${pathAfterFirstSlash}/`;

      const response = await fetch(proxyUrl, {
        method: 'GET',
        signal: controller.signal,
      });
      const blob = await response.blob();
      // Сохранение файла
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.download_name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        console.error('Ошибка скачивания:', error);
      }
    } finally {
      setIsDownloading(false);
      if (downloadControllerRef.current === controller) {
        downloadControllerRef.current = null;
      }
    }
  };

  const handleStopDownloadMessageFileClick = (): void => {
    if (downloadControllerRef.current) {
      downloadControllerRef.current.abort();
      downloadControllerRef.current = null;
      setIsDownloading(false);
    }
  };

  return { handleDownloadMessageFileClick, handleStopDownloadMessageFileClick, isDownloading };
};
