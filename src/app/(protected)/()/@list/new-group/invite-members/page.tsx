// import { InviteMembersBlock } from 'modules/new-group/ui/invite-members-block';
// import { JSX } from 'react';

// export default function InviteMembersPage(): JSX.Element {
//   return <InviteMembersBlock />;
// }
import { InviteMembersBlock } from 'modules/new-group/ui/invite-members-block';
import { cookies } from 'next/headers';
import { JSX } from 'react';

const BACKEND_WS = process.env.BACKEND_API_WS_URL!;

export default async function InviteMembersPage(): Promise<JSX.Element> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access')?.value;
  const wsUrl = `${BACKEND_WS}/ws/chat?authorization=${accessToken}`;
  return <InviteMembersBlock wsUrl={wsUrl} />;
}
