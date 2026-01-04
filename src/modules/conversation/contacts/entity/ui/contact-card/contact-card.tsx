import clsx from 'clsx';
import { getLastSeenLabel } from 'modules/conversation/contacts/lib';
import Link from 'next/link';
import React, { JSX } from 'react';
import { ImageUI } from 'shared/ui/image';
import { CardInfo } from './card-info';
import { CardSelection } from './card-selection';
import styles from './contact-card.module.scss';
import { ContactCardProps } from './contact-card.props';

export const ContactCard = ({ contact, selected, selectionMode, onSelectHandler }: ContactCardProps): JSX.Element => {
  const { uid, fullName, avatar, wasOnlineAt } = contact;
  const status = getLastSeenLabel(wasOnlineAt);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>): void => {
    if (selectionMode) {
      e.preventDefault();
      onSelectHandler?.();
    }
  };

  return (
    <li className={styles.li}>
      <Link
        href={`/chats/${uid}`}
        className={clsx(styles.card, {
          [styles.cardSelect]: selected,
        })}
        onClick={handleClick}
      >
        <ImageUI src={avatar} alt={fullName} width={40} height={40} classNames={{ root: styles.imageWrapper }} />

        <div className={styles.content}>
          <CardInfo fullName={fullName} status={status} selected={selected} />
          <CardSelection visible={selectionMode} selected={selected} />
        </div>
      </Link>

      <div className={styles.divider}></div>
    </li>
  );
};
