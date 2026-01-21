import { JSX, useRef, useState } from 'react';
import { CircularProgress } from '../../circular-progress-label';
import PauseIcon from './icons/Pause.svg';
import PlayIcon from './icons/Play.svg';
import styles from './voice.module.scss';
import { VoiceProps } from './voice.props';

export const Voice = ({ item, onToggle }: VoiceProps): JSX.Element => {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef<HTMLAudioElement>(null);

  const handleTimeUpdate = (): void => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = (): void => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleEnded = (): void => {
    setCurrentTime(0);
    togglePlay();
  };

  const togglePlay = (): void => {
    onToggle(item.id, audioRef.current);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className={styles.container} onClick={togglePlay}>
      <CircularProgress>{item.isPlaying ? <PauseIcon /> : <PlayIcon />}</CircularProgress>
      <audio
        ref={audioRef}
        src={item.url}
        onEnded={handleEnded}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
      />
      <div className={styles.fileInfo}>
        <div className={styles.fileName}>{item.file}</div>
        <div className={styles.fileDescription}>
          <div className={styles.fileSize}>{item.isPlaying ? formatTime(currentTime) : formatTime(duration)}</div>
          <div className={styles.dot}>•</div>
          <div className={styles.fileDate}>{item.created}</div>
        </div>
      </div>
    </div>
  );
};
