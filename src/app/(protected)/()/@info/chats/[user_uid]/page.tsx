import { InfoBlock } from 'modules/info';
import { JSX, Suspense } from 'react';

export default async function InfoBlockPage({
  params,
}: {
  params: Promise<{ user_uid: string }>;
}): Promise<JSX.Element> {
  const user_uid = (await params).user_uid;

  return (
    <Suspense>
      <InfoBlock uid={user_uid} />
    </Suspense>
  );
}
