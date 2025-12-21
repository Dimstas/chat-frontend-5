import clsx from 'clsx';
import { JSX } from 'react';
import { ImageUI } from 'shared/ui/image';
import styles from './empty-state.module.scss';
import { ConversationEmptyStateProps, EMPTY_STATE } from './empty-state.props';

export const ConversationEmptyState = ({ variant }: ConversationEmptyStateProps): JSX.Element => {
  const { src, title, subtitle } = EMPTY_STATE[variant];

  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <ImageUI src={src} alt={title} width={200} height={200} classNames={{ root: styles.imageWrapper }} />

        <div className={styles.textWrapper}>
          {variant === 'chats' ? (
            <>
              <span className={clsx(styles.text, styles.chatsText)}>{title}</span>
              <span className={clsx(styles.text, styles.chatsSubText)}>{subtitle}</span>
            </>
          ) : (
            <span className={clsx(styles.text, styles.contactsText)}>{title}</span>
          )}
        </div>
      </div>
    </div>
  );
};
