export const getLastSeenLabel = (wasOnlineAt: number): string => {
  const now = Math.floor(Date.now() / 1000);

  if (wasOnlineAt === 0) return 'онлайн';

  const diff = now - wasOnlineAt;

  if (diff < 60) return 'был(а) только что';
  if (diff < 3600) return `был(а) ${Math.floor(diff / 60)} минут назад`;
  if (diff < 86400) return `был(а) ${Math.floor(diff / 3600)} часов назад`;
  if (diff < 172800) return 'был(а) вчера';

  const date = new Date(wasOnlineAt * 1000);
  return `был(а) ${date.toLocaleDateString('ru-RU')}`;
};
