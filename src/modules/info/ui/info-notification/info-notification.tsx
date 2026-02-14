import clsx from 'clsx';
import { useChatStore } from 'modules/conversation/chats/model/chat.store';
import { useEditChatQuery } from 'modules/info/api/info.query';
import { JSX } from 'react';
import styles from './info-notification.module.scss';
import { InfoNotificationProps } from './info-notification.props';

export const InfoNotification = ({ chatId }: InfoNotificationProps): JSX.Element => {
  const { selected } = useChatStore();
  const { mutate: editChat } = useEditChatQuery(chatId ?? 0);

  const handleToggle = (): void => {
    if (selected?.chat) {
      editChat({
        notifications: !selected.chat.notifications,
      });
    }
  };

  return (
    <div className={styles.container}>
      <span className={styles.label}>Уведомления</span>
      <button className={styles.toggleButton} onClick={handleToggle}>
        <div className={clsx(styles.toggle, selected?.chat.notifications ? styles.enabled : styles.disabled)}>
          <div className={clsx(styles.circle, selected?.chat.notifications ? styles.enabled : styles.disabled)}></div>
        </div>
      </button>
    </div>
  );
};
