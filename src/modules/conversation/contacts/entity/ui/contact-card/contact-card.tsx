import clsx from 'clsx';
import { CardHeader, CardShell } from 'modules/conversation/shared/ui/card';
import React, { JSX } from 'react';
import { getLastSeenLabel } from 'shared/libs';
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
    <CardShell
      contact={contact}
      href={`/chats/${uid}`}
      imageOptions={{ src: avatar, alt: fullName, classNames: { root: styles.imageWrapper } }}
      selected={selected}
      selectAction={handleClick}
    >
      <div className={styles.card}>
        <div className={styles.info}>
          <CardHeader title={fullName} selected={selected} />
          <div
            className={clsx(
              styles.status,
              status === 'в сети' && styles.statusOnline,
              selected && styles.statusSelected,
            )}
          >
            {status}
          </div>
        </div>
        <CardSelection visible={selectionMode} selected={selected} />
      </div>
    </CardShell>
  );
};
