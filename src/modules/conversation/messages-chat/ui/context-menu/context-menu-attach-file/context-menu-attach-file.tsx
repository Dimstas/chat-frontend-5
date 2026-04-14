'use client';
import clsx from 'clsx';
import Image from 'next/image';
import { JSX } from 'react';
import Img from '../icons/image.svg';
import styles from './context-menu-attach-file.module.scss';
import type { ContextMenuAttachFileProps } from './context-menu-attach-file.props';
const URL_ICON = '/images/messages-chats/file.png';

export const ContextMenuAttachFile = ({
  contextMenuPos,
  handleCloseMenu,
}: ContextMenuAttachFileProps): JSX.Element | null => {
  return (
    <div
      className={styles.frame}
      onMouseLeave={handleCloseMenu}
      style={{ top: contextMenuPos.y, left: contextMenuPos.x }}
    >
      <div className={styles.wrapper}>
        <button className={clsx(styles.cell, styles.cellTop)}>
          <div className={styles.text}>Выбрать изображение</div>
          <div className={styles.icon}>
            <Img />
          </div>
        </button>
        <button className={clsx(styles.cell, styles.cellBottom)}>
          <div className={styles.text}>Выбрать файл</div>
          <div className={styles.icon}>
            <Image src={URL_ICON} width={17} height={17} alt="иконка" />
          </div>
        </button>
      </div>
    </div>
  );
};
