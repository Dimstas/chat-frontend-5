import React, { ReactNode } from 'react';

export type CardShellProps = {
  children: ReactNode;
  uid: string;
  chatId?: number;
  nickname?: string;
  isInContacts?: boolean;
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

  selectAction?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  selected?: boolean;
};
