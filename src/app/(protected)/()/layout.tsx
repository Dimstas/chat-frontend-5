import { ProtectedLayout } from 'layouts/protected-layout';
import { Navigation } from 'layouts/protected-layout/navigation';
import { JSX, ReactNode } from 'react';
import { QueryDevtools } from 'shared/query/query-devtools';
import { QueryProvider } from 'shared/query/query-provider';

export default function Layout({
  children,
  list,
  info,
}: {
  children: ReactNode;
  list: ReactNode;
  info: ReactNode;
}): JSX.Element {
  return (
    <QueryProvider>
      <ProtectedLayout nav={<Navigation />} list={children} main={list} info={list} />
      <QueryDevtools />
    </QueryProvider>
  );
}
