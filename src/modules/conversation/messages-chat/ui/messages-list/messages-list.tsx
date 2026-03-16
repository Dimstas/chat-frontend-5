'use client';
import type { FetchNextPageOptions, InfiniteData, InfiniteQueryObserverResult } from '@tanstack/react-query';
import { JSX, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useWebSocketChat } from '../../api/web-socket/use-web-socket-chat';
import { useIntersectionRead } from '../../hooks/use-intersection-read';
import { handlerMessagesList } from '../../lib/handler-messages-list';
import type { MessagesListApiResponse, RestMessageApi } from '../../model/messages-list';
import { useMessagesChatStore, useUserIdStore } from '../../zustand-store/zustand-store';
import { DateCard } from '../date-card/date-card';
import { IncomingMessagesCard } from '../message-card/incoming-message-card/incoming-message-card';
import { OutgoingMessagesCard } from '../message-card/outgoing-message-card/outgoing-message-card';
import { ScrollButton } from '../scroll-button/scroll-button';
import styles from './message-list.module.scss';
import { useFixedTargetIndex } from './use-fixed-target-index';

export const MessagesList = ({
  messagesList,
  wsUrl,
  currentUserId,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
}: {
  messagesList: RestMessageApi[];
  wsUrl: string;
  currentUserId: string;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: (
    options?: FetchNextPageOptions,
  ) => Promise<InfiniteQueryObserverResult<InfiniteData<MessagesListApiResponse>, unknown>>;
}): JSX.Element => {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const targetItemRef = useRef<HTMLDivElement | null>(null);
  const userIdStore = useUserIdStore((s) => s.userId);
  const messagesByUser = useMessagesChatStore((s) => s.messagesByUser[userIdStore]);
  const setMessagesForUser = useMessagesChatStore((s) => s.setMessagesForUser);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!userIdStore) return;
    const normalized = messagesList.map((m) => ({ ...m, status: 'sent' as const }));
    setMessagesForUser(userIdStore, normalized);
  }, [messagesList, userIdStore, setMessagesForUser]);

  const { results, messagesLength } = useMemo(() => {
    const messages = messagesByUser ?? [];
    console.log(messages);
    return { results: handlerMessagesList(messages), messagesLength: messages.length };
  }, [messagesByUser]);

  // Соберём flat-список в порядке рендера
  const dateKeysInRenderOrder = Object.keys(results).reverse();
  const flatList: Array<{
    date: string;
    message: RestMessageApi & { status?: 'pending' | 'sent' | 'failed' | 'read' };
  }> = [];
  dateKeysInRenderOrder.forEach((date) => {
    const msgs = results[date] ?? [];
    msgs
      .slice()
      .reverse()
      .forEach((m) => flatList.push({ date, message: m }));
  });
  //вычисляем targetIndex: первого непрочитанного входящего, иначе последний элемент
  const { targetIndex, setTargetIndex, lastIndex, currentFirstUnreadIncoming } = useFixedTargetIndex(
    results,
    currentUserId,
  );

  // хук ws + hook для определения прочтения видимости
  const { sendChangeStatusReadMessage } = useWebSocketChat(wsUrl, currentUserId);
  const { register } = useIntersectionRead(sendChangeStatusReadMessage);

  // Эффект прокрутки к targetIndex (если есть)
  useEffect(() => {
    console.log(targetIndex);
    if (targetIndex === -1) return;
    if (
      currentFirstUnreadIncoming !== -1 &&
      targetIndex !== null &&
      currentFirstUnreadIncoming - 1 > targetIndex &&
      currentFirstUnreadIncoming - 1 < lastIndex
    )
      return;
    const el = targetItemRef.current;
    if (!el) return;
    el.scrollIntoView({ behavior: 'auto', block: 'start' });
    //размонтируем targetIndex
    if (targetIndex === lastIndex) setTargetIndex(null);
  }, [results, messagesLength, targetIndex]);

  // локальная блокировка, чтобы избежать параллельных вызовов fetchNextPage
  const fetchingRef = useRef(false);
  // ---- Функция для безопасного вызова fetchNextPage с сохранением позиции при prepend ----
  // Эта функция вызывается при пересечении sentinel (вверху) — у вас может потребоваться триггерить fetchNextPage
  // и логика ниже также может быть использована при прокрутке вверх (если вы подгружаете старые).
  const fetchOlder = async (): Promise<void> => {
    const el = wrapperRef.current;
    if (!el) return;
    if (!hasNextPage) return;
    if (isFetchingNextPage || fetchingRef.current) return;
    // Сохраним текущие параметры прокрутки
    const previousScrollTop = el.scrollTop;
    const previousScrollHeight = el.scrollHeight;

    fetchingRef.current = true;
    try {
      await fetchNextPage();
      // После того, как новые (старые) сообщения были добавлены в DOM, реактивно обновится results,
      // и в этот момент браузер ещё может не законить рендер — сделаем requestAnimationFrame.
      requestAnimationFrame(() => {
        // Новая высота
        const newScrollHeight = el.scrollHeight;
        // Хотим сохранить визуальную позицию: выставляем scrollTop так, чтобы
        // элемент, который был внизу видимой области, оставался на том же месте.
        // Формула:
        // newScrollTop = newScrollHeight - previousScrollHeight + previousScrollTop
        const newScrollTop = newScrollHeight - previousScrollHeight + previousScrollTop;
        // Устанавливаем значение (защищаем от отрицательных)
        el.scrollTop = Math.max(0, newScrollTop);
      });
    } catch (e) {
      console.error('fetchNextPage failed', e);
    } finally {
      fetchingRef.current = false;
    }
  };
  // IntersectionObserver для бесконечной подгрузки:
  //  - наблюдаем sentinelRef.current (который рендерится в верху списка)
  useEffect((): (() => void) => {
    const sentinelEl = sentinelRef.current;
    if (!sentinelEl) {
      return () => {};
    }

    const onIntersect: IntersectionObserverCallback = (entries) => {
      const entry = entries[0];
      if (!entry) return;
      if (entry.isIntersecting) {
        // Если sentinel пересёкся — вызовем безопасный fetchOlder
        fetchOlder();
      }
    };

    const observer = new IntersectionObserver(onIntersect, {
      root: null,
      rootMargin: '200px',
      threshold: 0,
    });

    observer.observe(sentinelEl);

    return () => {
      observer.disconnect();
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, messagesLength]);

  // подгружаем когда пользователь приблизится к 1 элементу от вверха
  const triggerIndex = 1;

  //эффект для расчета позиции <ScrollButton /> внутри <MessagesList> в зависимости от размера экрана
  const [pos, setPos] = useState({ right: 0, bottom: 0 });
  useLayoutEffect(() => {
    const updatePos = (): void => {
      const rect = wrapperRef.current?.getBoundingClientRect();
      if (!rect) return;
      // расстояние от правого края контейнера до правого края окна
      const gapRight = Math.max(12, window.innerWidth - (rect.left + rect.width) + 5);
      const gapBottom = Math.max(12, Math.max(12, window.innerHeight - (rect.top + rect.height) + 1));
      setPos({ right: gapRight, bottom: gapBottom });
    };

    updatePos();
    window.addEventListener('resize', updatePos);
    // опционально: ResizeObserver для контейнера
    const ro = new ResizeObserver(updatePos);
    if (wrapperRef.current) ro.observe(wrapperRef.current);

    return (): void => {
      window.removeEventListener('resize', updatePos);
      ro.disconnect();
    };
  }, []);
  // обработчик события onClick для компонента  <ScrollButton /> медленно скролит в низ до первого сообщения
  const onClickScrollButton = (): void => {
    if (targetIndex === -1) return;
    const el = targetItemRef.current;
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      {/* Если список пуст, всё равно рендерим sentinel чтобы observer был стабилен */}
      {flatList.length === 0 && <div ref={sentinelRef} style={{ width: 1, height: 1 }} />}

      {dateKeysInRenderOrder.map<JSX.Element>((date: string) => (
        <div key={date}>
          <DateCard date={date} />
          {results[date]
            .slice()
            .reverse()
            .map<JSX.Element>(
              (message: RestMessageApi & { status?: 'pending' | 'sent' | 'failed' | 'read' }, index) => {
                // вычисляем globalIndex
                const dateIndex = dateKeysInRenderOrder.indexOf(date);
                let globalIndex = 0;
                for (let i = 0; i < dateIndex; i++) {
                  const d = dateKeysInRenderOrder[i];
                  globalIndex += (results[d] ?? []).length;
                }
                globalIndex += index;

                const isTarget = globalIndex === targetIndex;
                const isSentinel = globalIndex === triggerIndex;

                return (
                  <div
                    key={globalIndex}
                    tabIndex={-1}
                    ref={isTarget ? targetItemRef : isSentinel ? sentinelRef : undefined}
                  >
                    {targetIndex && globalIndex === targetIndex + 1 && lastIndex - targetIndex > 14 && (
                      <div className={styles.text}>непрочитанные сообщения</div>
                    )}
                    {message.from_user.uid === userIdStore ? (
                      <IncomingMessagesCard message={message} register={register} />
                    ) : (
                      <OutgoingMessagesCard message={message} />
                    )}
                  </div>
                );
              },
            )}
        </div>
      ))}
      {wrapperRef.current && wrapperRef.current.scrollHeight > wrapperRef.current.clientHeight && (
        <button
          style={{
            position: 'fixed',
            right: `${pos.right}px`,
            bottom: `${pos.bottom}px`,
          }}
          onClick={onClickScrollButton}
          aria-label="Scroll to top"
        >
          <ScrollButton />
        </button>
      )}
    </div>
  );
};
