import { JSX, useState } from 'react';
import { CircularProgress } from '../circular-progress-label';
import { FileContent } from '../profile-uploads.props';
import styles from './files-tab.module.scss';
import { FilesTabProps } from './files-tab.props';
import DownloadIcon from './icons/download.svg';
import FileIcon from './icons/file.svg';

export const FilesTab = ({ items }: FilesTabProps): JSX.Element => {
  const [localFiles, setLocalFiles] = useState<FileContent[]>(items);

  const handleDownload = (fileId: number): void => {
    setLocalFiles((prev) =>
      prev.map((file) => (file.id === fileId ? { ...file, isLoading: !file.isLoading, progress: 0 } : file)),
    );

    // имитация загрузки для проверки ui
    const interval = setInterval(() => {
      setLocalFiles((prev) => {
        const updated = prev.map((file) => {
          if (file.id === fileId && file.isLoading) {
            const newProgress = file.progress! + 10;
            return {
              ...file,
              progress: newProgress >= 100 ? 100 : newProgress,
              isLoading: newProgress < 100,
            };
          }
          return file;
        });

        const file = updated.find((f) => f.id === fileId);
        if (file?.progress === 100) {
          const link = document.createElement('a');
          link.href = file.url;
          link.download = file.file;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          clearInterval(interval);
        }

        return updated;
      });
    }, 500);
  };

  return (
    <div className={styles.container}>
      <ul className={styles.fileList}>
        {localFiles.map((item) => (
          <li key={item.id} className={styles.listItem}>
            <div className={styles.fileItem} onClick={() => handleDownload(item.id)}>
              <CircularProgress progress={item.progress} isLoading={item.isLoading}>
                {item.isLoading ? <DownloadIcon /> : <FileIcon />}
              </CircularProgress>
              <div className={styles.fileInfo}>
                <div className={styles.fileName}>{item.file}</div>
                <div className={styles.fileDescription}>
                  <div className={styles.fileSize}>{item.size}</div>
                  <div className={styles.dot}>•</div>
                  <div className={styles.fileDate}>{item.created}</div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
