import { JSX, useState } from 'react';
import { VoiceContent } from '../profile-uploads.props';
import { Voice } from './voice/voice';
import styles from './voices-tab.module.scss';
import { VoicesTabProps } from './voices-tab.props';

export const VoicesTab = ({ items }: VoicesTabProps): JSX.Element => {
  const [localFiles, setLocalFiles] = useState<VoiceContent[]>(items);

  const handleToggle = (fileId: number, audioRef: HTMLAudioElement | null): void => {
    setLocalFiles((prev) => {
      return prev.map((file) => {
        if (file.id === fileId) {
          if (!file.isPlaying) {
            audioRef?.play();
          } else {
            audioRef?.pause();
          }
          return { ...file, isPlaying: !file.isPlaying, audioRef: audioRef };
        } else {
          file.audioRef?.pause();
          return { ...file, isPlaying: false, audioRef: null };
        }
      });
    });
  };

  return (
    <div className={styles.container}>
      <ul className={styles.fileList}>
        {localFiles.map((item) => (
          <li key={item.id} className={styles.listItem}>
            <Voice item={item} onToggle={handleToggle} />
          </li>
        ))}
      </ul>
    </div>
  );
};
