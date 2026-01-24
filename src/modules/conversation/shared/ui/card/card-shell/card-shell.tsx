'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { JSX } from 'react';
import { ImageUI } from 'shared/ui/image';
import styles from './card-shell.module.scss';
import { CardShellProps } from './card-shell.props';

export const CardShell = ({ children, href, imageOptions, selected, selectAction }: CardShellProps): JSX.Element => {
  const pathname = usePathname();
  const isActive = pathname === href;

  const { src, alt, classNames } = imageOptions;

  return (
    <li className={styles.li}>
      <Link
        href={href}
        className={clsx(styles.link, {
          [styles.cardSelect]: selected || isActive,
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
  );
};
