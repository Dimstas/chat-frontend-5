import clsx from 'clsx';
import { PHOTOS } from 'modules/conversation/shared/utils/profile';
import { JSX, useState } from 'react';
import { ImageUI } from 'shared/ui/image';
import styles from './profile-uploads.module.scss';

export const ProfileUploads = (): JSX.Element => {
  const tabs = [
    {
      id: 'media',
      title: 'Медиа',
      content: PHOTOS,
    },
    {
      id: 'files',
      title: 'Файлы',
      content: [],
    },
    {
      id: 'voices',
      title: 'Голосовые',
      content: [],
    },
    {
      id: 'links',
      title: 'Ссылки',
      content: [],
    },
  ];

  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className={styles.container}>
      <div className={styles.tabs}>
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            className={clsx(styles.tab, activeTab === index && styles.active)}
            onClick={() => setActiveTab(index)}
          >
            <div className={styles.tabButtons}>
              <span className={styles.label}>{tab.title}</span>
              <div className={clsx(styles.border, activeTab === index && styles.active)}></div>
            </div>
          </button>
        ))}
      </div>

      <div className={styles.tabContent}>
        {tabs[activeTab].content.map((item) => (
          <ImageUI key={item.id} src={item.src} alt={item.alt} width={117} height={117} />
        ))}
      </div>
    </div>
  );
};
