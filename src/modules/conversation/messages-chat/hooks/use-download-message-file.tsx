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

  const handleDownloadMessageFileClick = async () => {
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

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      let blob: Blob;
      const contentType = response.headers.get('content-type') || '';

      if (contentType.startsWith('application/json')) {
        const json = await response.json();
        const base64String = typeof json === 'string' ? json : json.data;
        if (!base64String) throw new Error('Нет base64 в ответе');
        const pureBase64 = base64String.replace(/^data:[^;]+;base64,/, '').replace(/\s/g, '');
        const binaryString = atob(pureBase64);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        const ext = file.download_name.split('.').pop()?.toLowerCase() || '';
        const mimeMap: Record<string, string> = {
          jpg: 'image/jpeg',
          jpeg: 'image/jpeg',
          png: 'image/png',
          gif: 'image/gif',
          webp: 'image/webp',
          xls: 'application/vnd.ms-excel',
          xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          doc: 'application/msword',
          docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          pdf: 'application/pdf',
          zip: 'application/zip',
        };
        const mime = mimeMap[ext] || 'application/octet-stream';
        blob = new Blob([bytes], { type: mime });
      } else {
        blob = await response.blob();
      }

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

  const handleStopDownloadMessageFileClick = () => {
    if (downloadControllerRef.current) {
      downloadControllerRef.current.abort();
      downloadControllerRef.current = null;
      setIsDownloading(false);
    }
  };

  return { handleDownloadMessageFileClick, handleStopDownloadMessageFileClick, isDownloading };
};
