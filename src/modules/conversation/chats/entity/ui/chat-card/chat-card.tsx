'use client';

import clsx from 'clsx';
import { Chat } from 'modules/conversation/chats/entity';
import { useChatStore } from 'modules/conversation/chats/model/chat.store';
import { CardHeader, CardShell } from 'modules/conversation/shared/ui/card';
import { usePathname } from 'next/navigation';
import { JSX } from 'react';
import { CardHeaderMeta } from './card-header-meta';
import { CardNewMessageMeta } from './card-new-message-meta';
import { CardPreview } from './card-preview';
import styles from './chat-card.module.scss';
import { MutedIcon } from './icons';

export const ChatCard = ({ peer, chat, messages }: Chat): JSX.Element => {
  const { setSelected } = useChatStore();
  const { notifications, is_favorite, newMessageCount } = chat;
  const { firstName, lastName, uid } = peer;
  const {
    lastMessage: {
      updatedAt = undefined,
      content = '',
      hasForwardedMessage = false,
      hasRepliedMessage = false,
      filesSummary = undefined,
    } = {},
  } = messages || {};

  const pathname = usePathname();
  const isSelected = pathname === `/chats/${peer.uid}` || pathname === `/chats/${peer.uid}/info`;

  const handleSelect = (): void => {
    setSelected(peer.uid);
  };

  return (
    <CardShell
      uid={uid}
      nickname={peer.nickname}
      isInContacts={peer.isInContacts}
      href={`/chats/${uid}`}
      imageOptions={{
        src: peer.avatarUrl,
        alt: chat.name,
        classNames: { root: styles.imageWrapper },
      }}
      selectAction={handleSelect}
    >
      <div className={styles.card}>
        <div className={styles.header}>
          <CardHeader title={`${firstName} ${lastName}`} selected={isSelected}>
            {notifications && <MutedIcon className={styles.mutedIcon} />}
          </CardHeader>

          <CardHeaderMeta
            className={clsx(styles.headerMeta, isSelected ? styles.headerMetaSelected : undefined)}
            updatedAt={updatedAt}
          />
        </div>

        <div className={clsx(styles.preview, { [styles.previewSelected]: isSelected })}>
          <CardPreview
            content={content}
            filesSummary={filesSummary}
            replied={hasRepliedMessage}
            forwarded={hasForwardedMessage}
          />

          <CardNewMessageMeta newMessageCount={newMessageCount} isFavorite={is_favorite} />
        </div>
      </div>
    </CardShell>
  );
};
