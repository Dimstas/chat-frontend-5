import { ProtectedLayout } from 'layouts/protected-layout';
import { Navigation } from 'layouts/protected-layout/navigation';
import { ProfileBlock } from 'modules/profile';
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
      <ProtectedLayout
        nav={<Navigation />}
        list={list}
        main={children}
        info={<ProfileBlock uid="486746f7-034e-42b1-a194-ba1dcdd37f93" />}
      />
      <QueryDevtools />
    </QueryProvider>
  );
}
