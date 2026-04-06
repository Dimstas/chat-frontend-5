import { parseJwtToken } from 'modules/conversation/messages-chat/utils/parse-jwt-token';
import { InfoContactScreen } from 'modules/info/screens/contact';
import { InfoGroupScreen } from 'modules/info/screens/group';
import { cookies } from 'next/headers';
import { JSX, Suspense } from 'react';

const BACKEND_WS = process.env.BACKEND_API_WS_URL!;

export default async function InfoBlockPage({
  params,
}: {
  params: Promise<{ user_uid: string }>;
}): Promise<JSX.Element> {
  const user_uid = (await params).user_uid;
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access')?.value;
  const wsUrl = `${BACKEND_WS}/ws/chat?authorization=${accessToken}`;
  const payload = parseJwtToken(accessToken ?? '');

  const isGroup = user_uid.startsWith('group');

  return (
    <Suspense>
      {isGroup ? (
        <InfoGroupScreen uid={user_uid} wsUrl={wsUrl} currentUid={payload.user_id} />
      ) : (
        <InfoContactScreen uid={user_uid} wsUrl={wsUrl} currentUid={payload.user_id} />
      )}
    </Suspense>
  );
}
