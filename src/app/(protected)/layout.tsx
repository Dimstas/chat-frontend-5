import { ProtectedLayout } from 'layouts/protected-layout';
import { Navigation } from 'layouts/protected-layout/navigation';
import { JSX, ReactNode } from 'react';

export default function Layout({ children }: { children: ReactNode }): JSX.Element {
  return <ProtectedLayout nav={<Navigation />} list={<div>Список</div>} main={children} info={<></>} />;
}
