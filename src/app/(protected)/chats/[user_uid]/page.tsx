import { notFound } from 'next/navigation';
import { JSX, Suspense } from 'react';
export default async function MessagesPage({
  params,
}: {
  params: Promise<{ user_uid: string }>;
}): Promise<JSX.Element> {
  const user_uid = (await params).user_uid;
  notFound();
  return <Suspense></Suspense>;
}
