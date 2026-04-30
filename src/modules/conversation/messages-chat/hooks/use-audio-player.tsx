'use client';
import { RefObject, useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import type { RestMessageApi } from '../model/messages-list';
import { useAudioManagerStore } from '../zustand-store/zustand-store';

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
  const isPlayingRef = useRef<boolean>(false);
  const isDestroyedRef = useRef<boolean>(false);
  const { currentPlayingId, setCurrentPlaying, stopCurrentPlaying } = useAudioManagerStore();
  const abortControllerRef = useRef<AbortController | null>(null);

  const audioUrl = message.files_list.length
    ? message.files_list[0].file_url
    : message.forwarded_messages[0]?.files_list[0]?.file_url;

  const stopPlayback = (): void => {
    if (wavesurferRef.current && !isDestroyedRef.current && isPlaying) {
      try {
        wavesurferRef.current.pause();
        setIsPlaying(false);
      } catch (err) {
        console.warn('Error during stopPlayback:', err);
      }
    }
  };

  useEffect(() => {
    if (isPlaying && message.uid) {
      setCurrentPlaying(message.uid, stopPlayback);
    }

    return (): void => {
      if (currentPlayingId === message.uid) {
        setCurrentPlaying(null);
      }
    };
  }, [isPlaying, message.uid, currentPlayingId, setCurrentPlaying]);

  useEffect(() => {
    if (!waveformRef.current || !audioUrl) return;

    let ws: WaveSurfer | null = null;
    let isLoadingRef = false;

    // Сбрасываем флаг уничтожения
    isDestroyedRef.current = false;

    // Создаем новый AbortController для отмены загрузки
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    const initWaveSurfer = async (): Promise<void> => {
      if (isLoadingRef || !waveformRef.current || signal.aborted) return;
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
          autoScroll: false,
          mediaControls: false,
        });

        wavesurferRef.current = ws;

        ws.on('ready', () => {
          if (ws && !signal.aborted && !isDestroyedRef.current) {
            setTotalDuration(ws.getDuration());
            setIsLoading(false);
            if (savedTimeRef.current > 0) {
              ws.seekTo(savedTimeRef.current / ws.getDuration());
              setCurrentTime(savedTimeRef.current);
            }
          }
        });

        ws.on('play', () => {
          if (!signal.aborted && !isDestroyedRef.current) {
            setIsPlaying(true);
            isPlayingRef.current = true;
          }
        });

        ws.on('pause', () => {
          if (!signal.aborted && !isDestroyedRef.current) {
            setIsPlaying(false);
            isPlayingRef.current = false;
            if (ws && !isDestroyedRef.current) {
              savedTimeRef.current = ws.getCurrentTime();
              setCurrentTime(savedTimeRef.current);
            }
          }
        });

        ws.on('finish', () => {
          if (!signal.aborted && !isDestroyedRef.current) {
            setIsPlaying(false);
            isPlayingRef.current = false;
            setCurrentTime(0);
            savedTimeRef.current = 0;
          }
        });

        ws.on('timeupdate', (time) => {
          if (!signal.aborted && !isDestroyedRef.current) {
            setCurrentTime(time);
            if (isPlayingRef.current) {
              savedTimeRef.current = time;
            }
          }
        });

        ws.on('error', (err) => {
          if (signal.aborted || err?.name === 'AbortError' || isDestroyedRef.current) return;
          console.error('WaveSurfer ошибка:', err);
          setIsLoading(false);
        });

        // Загружаем аудио с возможностью отмены
        await ws.load(audioUrl);
      } catch (err) {
        if (signal.aborted || (err instanceof Error && err.name === 'AbortError') || isDestroyedRef.current) {
          return;
        }
        console.error('WaveSurfer error:', err);
        setIsLoading(false);
      } finally {
        if (!signal.aborted && waveformRef.current && !isDestroyedRef.current) {
          isLoadingRef = false;
        }
      }
    };

    initWaveSurfer();

    return (): void => {
      // Устанавливаем флаг уничтожения
      isDestroyedRef.current = true;

      // Отменяем загрузку
      if (abortControllerRef.current) {
        try {
          abortControllerRef.current.abort();
        } catch (err) {
          // Игнорируем ошибки при отмене
        }
        abortControllerRef.current = null;
      }

      isLoadingRef = false;

      if (ws) {
        try {
          // Останавливаем воспроизведение перед уничтожением
          if (isPlayingRef.current) {
            ws.pause();
            savedTimeRef.current = ws.getCurrentTime();
          }

          // Отключаем все обработчики
          ws.unAll();

          // Уничтожаем экземпляр - просто вызываем destroy, не проверяя isDestroyed
          ws.destroy();
        } catch (err) {
          // Игнорируем ошибки при уничтожении
          if (err instanceof Error && err.name !== 'InvalidStateError') {
            console.warn('Error destroying WaveSurfer:', err);
          }
        }
      }

      wavesurferRef.current = null;

      // Сбрасываем состояния
      setIsPlaying(false);
      isPlayingRef.current = false;
      setIsLoading(true);
    };
  }, [audioUrl]);

  const handlePlayPause = (): void => {
    if (isDestroyedRef.current) return;

    if (isPlaying) {
      stopPlayback();
      stopCurrentPlaying();
    } else {
      setCurrentPlaying(message.uid, stopPlayback);
      try {
        // Проверяем существование экземпляра перед вызовом play
        if (wavesurferRef.current && !isDestroyedRef.current) {
          wavesurferRef.current.play();
        }
      } catch (err) {
        console.error('Error playing audio:', err);
      }
    }
  };

  return { handlePlayPause, currentTime, totalDuration, waveformRef, isPlaying, isLoading };
};
