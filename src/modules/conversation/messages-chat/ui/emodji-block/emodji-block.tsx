'use client';
import { JSX } from 'react';
import styles from './emodji-block.module.scss';
import { MessageField } from './message-field/message-field';
import { RecentEmodji } from './recent-emodji/recent-emodji';
import { Smileys } from './smileys/smileys';

export const EmodjiBlock = ({
  handleEmojiSelect,
  recentEmoji,
  position,
}: {
  handleEmojiSelect: (emoji: string) => void;
  recentEmoji: string[];
  position: { x: number; y: number };
}): JSX.Element => {
  if (recentEmoji.length) {
    return (
      <div className={styles.wrapper} style={{ top: position.y, left: position.x }}>
        <div className={styles.containerScroll}>
          <RecentEmodji recentEmoji={recentEmoji} handleEmojiSelect={handleEmojiSelect} />
          <Smileys handleEmojiSelect={handleEmojiSelect} />
        </div>
        <MessageField isRecentEmoji={true} />
      </div>
    );
  } else {
    return (
      <div className={styles.wrapper} style={{ top: position.y, left: position.x }}>
        <div className={styles.containerScroll}>
          <Smileys handleEmojiSelect={handleEmojiSelect} />
        </div>
        <MessageField isRecentEmoji={false} />
      </div>
    );
  }
};
