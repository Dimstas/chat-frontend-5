import clsx from 'clsx';
import { useChatsStore } from 'modules/conversation/chats/model/search';
import { CardHeader, CardShell } from 'modules/conversation/shared/ui/card';
import { JSX } from 'react';
import { getLastSeenLabel } from 'shared/libs';
import styles from './chat-card-modal.module.scss';
import { ChatCardModalProps } from './chat-card-modal.props';

export const ChatCardModal = ({ chat, onSelectHandler }: ChatCardModalProps): JSX.Element => {
  const { selected, setSelected } = useChatsStore();
  const { firstName, lastName, uid, nickname, avatarUrl, wasOnlineAt } = chat.peer;
  const { id } = chat.chat;

  const fullName = `${firstName} ${lastName}`;
  const status = getLastSeenLabel(wasOnlineAt);
  const isSelected = !!selected && selected === id;

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>): void => {
    e.preventDefault();
    setSelected(id);
    onSelectHandler?.();
  };

  return (
    <CardShell
      chatId={id}
      nickname={nickname}
      href={`/chats/${uid}`}
      imageOptions={{ src: avatarUrl, alt: fullName, classNames: { root: styles.imageWrapper } }}
      selectAction={handleClick}
      selected={isSelected}
      isModal={true}
    >
      <div className={styles.card}>
        <div className={styles.info}>
          <CardHeader title={fullName} selected={isSelected} />
          <div
            className={clsx(
              styles.status,
              status === 'в сети' && styles.statusOnline,
              isSelected && styles.statusSelected,
            )}
          >
            {status}
          </div>
        </div>
      </div>
    </CardShell>
  );
};
