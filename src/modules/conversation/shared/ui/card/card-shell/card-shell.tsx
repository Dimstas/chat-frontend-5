'use client';
import clsx from 'clsx';
import { ContextMenu } from 'modules/conversation/chats/ui/context-menu/context-menu';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { JSX, MouseEvent, useState } from 'react';
import { ImageUI } from 'shared/ui/image';
import styles from './card-shell.module.scss';
import { CardShellProps } from './card-shell.props';

export const CardShell = ({ children, href, imageOptions, selected, selectAction }: CardShellProps): JSX.Element => {
  const pathname = usePathname();
  const isActive = pathname === href;
  const { src, alt, classNames } = imageOptions;
  const [contextMenuPos, setContextMenuPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [contextMenuVisible, setContextMenuVisible] = useState<boolean>(false);

  const handleContextMenu = (event: MouseEvent<HTMLDivElement>): void => {
    event.preventDefault();
    const menuHeight = 238;
    const y = event.pageY;
    const adjustedY = y + 5;
    const constrainedY = adjustedY + menuHeight - (window.innerHeight - 245) > 0 ? y - menuHeight - 10 : adjustedY;
    const constrainedX = 387;
    setContextMenuPos({ x: constrainedX, y: constrainedY });
    setContextMenuVisible(true);
  };

  const handleCloseMenu = (): void => {
    setContextMenuVisible(false);
  };

  return (
    <div onContextMenu={handleContextMenu} onMouseLeave={handleCloseMenu}>
      <ContextMenu position={contextMenuPos} visible={contextMenuVisible} onClose={handleCloseMenu} />
      <li className={styles.li}>
        <Link
          href={href}
          className={clsx(styles.link, {
            [styles.cardSelect]: selected || isActive,
            [styles.contextMenu]: contextMenuVisible,
          })}
          onClick={selectAction}
        >
          <ImageUI
            src={src}
            alt={alt}
            fill
            classNames={{
              root: clsx(styles.imageWrapper, classNames?.root),
              image: clsx(styles.image, classNames?.image),
            }}
          />

          {children}
        </Link>
        <div className={styles.divider}></div>
      </li>
    </div>
  );
};
