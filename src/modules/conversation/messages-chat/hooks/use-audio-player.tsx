'use client';

import { RefObject, useCallback, useEffect, useRef, useState } from 'react';
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
  message: RestMessageApi & {
    status?: 'pending' | 'sent' | 'failed' | 'read';
  },
): UseAudioPlayerReturn => {
  const waveformRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const { currentPlayingId, setCurrentPlaying, stopCurrentPlaying } = useAudioManagerStore();
  const audioUrl = message.files_list.length
    ? message.files_list[0].file_url
    : message.forwarded_messages[0]?.files_list[0]?.file_url;
  //Остановка текущего экземпляра
  const stopPlayback = useCallback(() => {
    const ws = wavesurferRef.current;
    if (!ws) return;

    ws.pause();
    setIsPlaying(false);
  }, []);

  //Инициализация WaveSurfer
  useEffect(() => {
    if (!waveformRef.current || !audioUrl) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoading(true);

    const ws = WaveSurfer.create({
      container: waveformRef.current,
      backend: 'MediaElement',
      waveColor: '#cec8ff',
      progressColor: '#9587f5',
      barWidth: 3,
      barGap: 1.5,
      barRadius: 10,
      height: 20,
      normalize: true,
      barAlign: 'bottom',
      barMinHeight: 2,
      autoScroll: false,
      mediaControls: false,
    });
    wavesurferRef.current = ws;
    ws.load(audioUrl);
    ws.on('ready', () => {
      setTotalDuration(ws.getDuration());
      setIsLoading(false);
    });
    ws.on('play', () => {
      setIsPlaying(true);
    });
    ws.on('pause', () => {
      setIsPlaying(false);
    });
    ws.on('finish', () => {
      setIsPlaying(false);
      setCurrentTime(0);
    });
    ws.on('timeupdate', (time: number) => {
      setCurrentTime(time);
    });
    ws.on('error', (err) => {
      console.error('WaveSurfer error:', err);
      setIsLoading(false);
    });
    ws.once('interaction', () => {
      ws.play();
    });
    return (): void => {
      ws.destroy();
      wavesurferRef.current = null;
      setIsPlaying(false);
    };
  }, [audioUrl]);

  const isCurrentPlaying = useAudioManagerStore((state) => state.currentPlayingId === message.uid);
  //авто‑стоп если другой начал играть
  useEffect(() => {
    const ws = wavesurferRef.current;
    if (!ws) return;

    if (!isCurrentPlaying && ws.isPlaying()) {
      ws.pause();
    }
  }, [isCurrentPlaying]);

  //Play / Pause
  const handlePlayPause = (): void => {
    const ws = wavesurferRef.current;
    if (!ws) return;

    if (isPlaying) {
      ws.pause();
      stopCurrentPlaying();
    } else {
      setCurrentPlaying(message.uid, () => {
        ws.pause();
        setIsPlaying(false);
      });

      ws.play();
    }
  };

  return {
    handlePlayPause,
    currentTime,
    totalDuration,
    waveformRef,
    isPlaying,
    isLoading,
  };
};
