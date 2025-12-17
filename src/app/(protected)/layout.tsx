import { ProtectedLayout } from 'layouts/protected-layout';
import { Navigation } from 'layouts/protected-layout/navigation';
import { JSX, ReactNode } from 'react';
import { QueryDevtools } from 'shared/query/query-devtools';
import { QueryProvider } from 'shared/query/query-provider';

export default function Layout({ children }: { children: ReactNode }): JSX.Element {
  return (
    <QueryProvider>
      <ProtectedLayout nav={<Navigation />} list={<div>Список</div>} main={children} info={<></>} />
      <QueryDevtools />
    </QueryProvider>
  );
}
