'use client';
import { InfiniteData, useInfiniteQuery, UseInfiniteQueryResult } from '@tanstack/react-query';
import { MessagesListApiResponse, MessagesListQuery } from '../model/messages-list';
import { getMessagesList } from './messages-list.api';

const PAGE_SIZE = 30;

export const useMessagesListQuery = (
  user_uid: string,
  params: MessagesListQuery,
): UseInfiniteQueryResult<InfiniteData<MessagesListApiResponse>, unknown> => {
  return useInfiniteQuery<
    MessagesListApiResponse,
    unknown,
    InfiniteData<MessagesListApiResponse>,
    ['messages', 'messages-list', string, MessagesListQuery],
    number
  >({
    queryKey: ['messages', 'messages-list', user_uid, params],
    initialPageParam: 1,

    queryFn: ({ pageParam }) => {
      return getMessagesList(user_uid, {
        //...params,
        page: pageParam,
        page_size: PAGE_SIZE,
      });
    },

    getNextPageParam: (lastPage) => {
      if (!lastPage.next) return undefined;
      const url = new URL(lastPage.next, 'http://localhost');
      return Number(url.searchParams.get('page'));
    },
  });
};

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
