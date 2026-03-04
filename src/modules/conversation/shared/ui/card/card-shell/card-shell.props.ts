import React, { ReactNode } from 'react';

export type CardShellProps = {
  children: ReactNode;
  chatId?: number;
  lastMessageId?: number;
  hasNewMessages?: boolean;
  nickname?: string;
  isInContacts?: boolean;
  isFavorite?: boolean;
  notifications?: boolean;
  href: string;
  imageOptions: {
    src: string;
    alt: string;
    classNames?: {
      root?: string;
      image?: string;
    };
  };
  hasContextMenu?: boolean;
  selectAction?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  selected?: boolean;
};
