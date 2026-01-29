import { JSX } from 'react';
import { ImageUI } from 'shared/ui/image';
import styles from './recent-emodji.module.scss';

export const RecentEmodji = ({
  recentEmoji,
  handleEmojiSelect,
}: {
  recentEmoji: string[];
  handleEmojiSelect: (emoji: string) => void;
}): JSX.Element => {
  return (
    <>
      <div className={styles.title}>
        <div className={styles.text}>Недавние</div>
      </div>
      <div className={styles.recentEmodji}>
        {recentEmoji.length &&
          recentEmoji.map((emoji, index) => (
            <div key={index} className={styles.emodji}>
              <button onClick={() => handleEmojiSelect(emoji)}>
                <ImageUI
                  src={`/images/messages-chats/smileysIcons/${emoji}.svg`}
                  alt="смаил"
                  loading="eager"
                  width={32}
                  height={32}
                />
              </button>
            </div>
          ))}
      </div>
    </>
  );
};
