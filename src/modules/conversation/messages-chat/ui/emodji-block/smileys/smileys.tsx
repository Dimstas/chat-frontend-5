import { emojisArray } from 'modules/conversation/messages-chat/utils/emojis-array';
import { JSX } from 'react';
import { ImageUI } from 'shared/ui/image';
import styles from './smileys.module.scss';

export const Smileys = ({ handleEmojiSelect }: { handleEmojiSelect: (emoji: string) => void }): JSX.Element => {
  return (
    <>
      <div className={styles.title}>
        <div className={styles.text}>Эмоции</div>
      </div>
      <div className={styles.smileysContainer}>
        {emojisArray(152).map((emoji, index) => (
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
