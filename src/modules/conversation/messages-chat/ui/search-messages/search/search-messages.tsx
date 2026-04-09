import { useSearchMessagesStore } from 'modules/conversation/messages-chat/zustand-store/zustand-store';
import { JSX, useEffect, useRef } from 'react';
import Close from './icons/close.svg';
import Search from './icons/search.svg';
import styles from './search-messages.module.scss';
import type { SearchMessagesProps } from './search-messages.props';

export const SearchMessages = ({ setSearchMessagesVisible }: SearchMessagesProps): JSX.Element => {
  const searchMessagesStore = useSearchMessagesStore((s) => s.searchMessages);
  const setSearchMessagesStore = useSearchMessagesStore((s) => s.setSearchMessages);
  const clearSearchMessagesStore = useSearchMessagesStore((s) => s.clearSearchMessages);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  //устанавливае изначально фокус на <input> поиска
  useEffect(() => {
    inputRef.current?.focus();
  }, []);
  const handlerOnClickClose = (): void => {
    clearSearchMessagesStore();
    setSearchMessagesVisible(false);
  };
  const handleBlur = (e: React.FocusEvent): void => {
    const related = e.relatedTarget as Node | null;
    // Если focus ушёл внутри контейнера — не закрываем
    if (containerRef.current && related && containerRef.current.contains(related)) return;
    // Действия при потере фокуса
    handlerOnClickClose();
  };
  return (
    <div ref={containerRef} onBlur={handleBlur} tabIndex={-1} className={styles.wrapperSearch}>
      <div className={styles.iconSearch}>
        <Search />
      </div>
      <input
        ref={inputRef}
        className={styles.inputSearch}
        value={searchMessagesStore}
        onChange={(e) => setSearchMessagesStore(e.target.value)}
        placeholder="Поиск в чате"
        aria-label="Поиск в чате"
      />
      <div className={styles.iconSearch} onClick={handlerOnClickClose}>
        <Close />
      </div>
    </div>
  );
};
