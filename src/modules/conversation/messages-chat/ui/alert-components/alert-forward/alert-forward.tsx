'use client';
import { Chat } from 'modules/conversation/chats/entity';
import { useChatsScreen } from 'modules/conversation/chats/screens/use-chats-screen';
import Image from 'next/image';
import { JSX, useEffect, useRef } from 'react';
import { getLastSeenLabel } from 'shared/libs';
import styles from './alert-forward.module.scss';
import { AlertForwardProps } from './alert-forward.props';
import Close from './icons/close.svg';
import DefauitBox from './icons/default-box.svg';
import Search from './icons/search.svg';

export const AlertForward = ({ onOk, onCancel }: AlertForwardProps): JSX.Element => {
  const { chats, search, setSearch, clearSearch } = useChatsScreen();
  const inputRef = useRef<HTMLInputElement | null>(null);
  //устанавливае изначально фокус на <input> поиска
  useEffect(() => {
    inputRef.current?.focus();
  }, []);
  const handlerOnClickInput = (): void => {
    clearSearch?.();
    inputRef.current?.focus();
  };
  return (
    <div
      className={styles.wrapper}
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          onCancel();
        }
      }}
    >
      <div className={styles.headerTop}>
        <div className={styles.textHeaderTop}>Переслать</div>
        <button onClick={onCancel}>
          <div className={styles.icon}>
            <Close />
          </div>
        </button>
      </div>
      <div className={styles.searchWrapper}>
        <div className={styles.searchContainer}>
          <div className={styles.icon}>
            <Search />
          </div>
          <input
            ref={inputRef}
            className={styles.searchInput}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                clearSearch?.();
              }
            }}
            placeholder="Поиск"
            aria-label="Поиск"
          />
          {search && (
            <button>
              <div className={styles.icon}>
                <Close onClick={handlerOnClickInput} />
              </div>
            </button>
          )}
        </div>
      </div>
      {!!chats.length &&
        chats.map((chat) => {
          return <AlertForwardChatCard key={chat.chat.id} chat={chat} onOk={onOk} />;
        })}
      {search && !chats.length && <DefauitBox />}
    </div>
  );
};

const AlertForwardChatCard = ({ chat, onOk }: { chat: Chat; onOk: () => void }): JSX.Element => {
  const { avatarUrl = '', firstName = '', lastName = '', wasOnlineAt = null } = chat?.peer ?? {};
  const status = getLastSeenLabel(wasOnlineAt);
  return (
    <div className={styles.cardWrapper} onClick={onOk}>
      <div className={styles.avatar}>
        {avatarUrl ? (
          <Image src={avatarUrl} alt="Аватар" width={40} height={40} />
        ) : (
          <Image src="/images/messages-chats/default-avatar.svg" alt="Дефолтный Аватар" width={40} height={40} />
        )}
      </div>
      <div className={styles.nameEndStatus}>
        <div className={styles.name}>{`${firstName} ${lastName}`} </div>
        <div className={styles.status}>{status}</div>
      </div>
    </div>
  );
};
