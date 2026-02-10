import { ProfileBlock } from 'modules/profile';
import { JSX } from 'react';

export default async function InfoBlockPage({
  params,
}: {
  params: Promise<{ user_uid: string }>;
}): Promise<JSX.Element> {
  const user_uid = (await params).user_uid;

  return <ProfileBlock uid={user_uid} />;
}
