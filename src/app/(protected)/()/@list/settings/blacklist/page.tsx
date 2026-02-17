'use client';

import { useGetBlacklist } from 'shared/query/blacklist.query';

export default function BlacklistPage() {
  const { data, isLoading, error } = useGetBlacklist();

  if (isLoading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {(error as Error).message}</div>;

  console.log(data,'вот')
  return (
    <div>
      <h1>Черный список</h1>
      <ul>
        {data?.results.map((user) => (
          <li key={user.uid}>{user.nickname} ({user.phone})</li>
        ))}
      </ul>
    </div>
  );
}