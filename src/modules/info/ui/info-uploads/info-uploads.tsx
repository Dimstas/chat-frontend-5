import clsx from 'clsx';
import { FILES, LINKS, PHOTOS, VOICES } from 'modules/info/shared/utils/mock';
import { JSX, ReactElement, useState } from 'react';
import { FilesTab } from './files-tab';
import styles from './info-uploads.module.scss';
import { InfoUploadsProps } from './info-uploads.props';
import { LinksTab } from './links-tab';
import { MediaTab } from './media-tab';
import { ParticipantsTab } from './participants-tab';
import { VoicesTab } from './voices-tab';

export const InfoUploads = ({ uid, tabs, chatKey, currentUid }: InfoUploadsProps): JSX.Element => {
  void uid;

  const [activeTab, setActiveTab] = useState(0);

  const renderTab = (): ReactElement | null => {
    const tab = tabs[activeTab];

    switch (tab.id) {
      case 'media':
        return <MediaTab items={PHOTOS} />;
      case 'files':
        return <FilesTab items={FILES} />;
      case 'voices':
        return <VoicesTab items={VOICES} />;
      case 'links':
        return <LinksTab items={LINKS} />;
      case 'members':
        return <ParticipantsTab currentUid={currentUid} chatKey={chatKey || ''} />;
      default:
        return null;
    }
  };

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

      <div className={styles.tabContent}>{renderTab()}</div>
    </div>
  );
};
