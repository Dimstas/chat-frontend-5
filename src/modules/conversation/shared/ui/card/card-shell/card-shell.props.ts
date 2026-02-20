import React, { ReactNode } from 'react';

export type CardShellProps = {
  children: ReactNode;
  uid: string;
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
