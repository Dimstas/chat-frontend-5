'use client';
import { RefObject, useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import type { RestMessageApi } from '../model/messages-list';

type UseAudioPlayerReturn = {
  handlePlayPause: () => void;
  currentTime: number;
  totalDuration: number;
  waveformRef: RefObject<HTMLDivElement | null>;
  isPlaying: boolean;
  isLoading: boolean;
};

export const useAudioPlayer = (
  message: RestMessageApi & { status?: 'pending' | 'sent' | 'failed' | 'read' },
): UseAudioPlayerReturn => {
  const waveformRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const savedTimeRef = useRef<number>(0);
  const isPlayingRef = useRef<boolean>(false); // Добавляем ref для отслеживания состояния воспроизведения
  // Получаем URL аудиофайла
  const audioUrl = message.files_list.length
    ? message.files_list[0].file_url
    : message.forwarded_messages[0]?.files_list[0]?.file_url;
  useEffect(() => {
    if (!waveformRef.current || !audioUrl) return;
    let ws: WaveSurfer | null = null;
    let isLoadingRef = false; // Флаг процесса загрузки
    const initWaveSurfer = async (): Promise<void> => {
      // Предотвращаем повторную инициализацию
      if (isLoadingRef || !waveformRef.current) return;
      isLoadingRef = true;
      setIsLoading(true);
      try {
        ws = WaveSurfer.create({
          container: waveformRef.current!,
          waveColor: '#cec8ff',
          progressColor: '#9587f5',
          barWidth: 3,
          barGap: 1.5,
          barRadius: 10,
          height: 20,
          normalize: true,
          backend: 'WebAudio',
          barAlign: 'bottom',
          barMinHeight: 2,
        });
        wavesurferRef.current = ws;
        // Обработчики событий
        ws.on('ready', () => {
          if (ws) {
            setTotalDuration(ws.getDuration());
            setIsLoading(false);
            // Если есть сохранённая позиция, восстанавливаем её
            if (savedTimeRef.current > 0) {
              ws.seekTo(savedTimeRef.current / ws.getDuration());
              setCurrentTime(savedTimeRef.current);
            }
          }
        });
        ws.on('play', () => {
          setIsPlaying(true);
          isPlayingRef.current = true;
        });
        ws.on('pause', () => {
          setIsPlaying(false);
          isPlayingRef.current = false;
          // Сохраняем текущую позицию при паузе
          if (ws) {
            savedTimeRef.current = ws.getCurrentTime();
            setCurrentTime(savedTimeRef.current);
          }
        });
        ws.on('finish', () => {
          setIsPlaying(false);
          isPlayingRef.current = false;
          setCurrentTime(0);
          savedTimeRef.current = 0;
        });
        ws.on('timeupdate', (time) => {
          setCurrentTime(time);
          // Обновляем сохранённую позицию во время воспроизведения
          if (isPlayingRef.current) {
            savedTimeRef.current = time;
          }
        });
        ws.on('error', (err) => {
          console.error('WaveSurfer ошибка:', err);
          setIsLoading(false);
        });
        // Загружаем аудио по URL
        await ws.load(audioUrl);
      } catch (err) {
        // Игнорируем ошибку, если компонент уже размонтирован
        if (err instanceof Error && err.name !== 'AbortError') {
          console.error('WaveSurfer error:', err);
        }
      } finally {
        if (waveformRef.current) {
          isLoadingRef = false;
          setIsLoading(false);
        }
      }
    };
    initWaveSurfer();
    return (): void => {
      isLoadingRef = false;
      if (ws) {
        try {
          if (isPlayingRef.current) {
            savedTimeRef.current = ws.getCurrentTime();
          }
          ws.destroy();
        } catch (err) {
          // Игнорируем ошибки
        }
      }
      wavesurferRef.current = null;
    };
  }, [audioUrl]);
  const handlePlayPause = (): void => {
    if (wavesurferRef.current && !isLoading) {
      console.log(wavesurferRef.current);
      wavesurferRef.current.playPause();
    }
  };
  return { handlePlayPause, currentTime, totalDuration, waveformRef, isPlaying, isLoading };
};
