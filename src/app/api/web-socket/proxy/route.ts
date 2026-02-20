import { cookies } from 'next/headers';
const BACKEND = process.env.BACKEND_API_URL!;

export default async function SEND(): Promise<void> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access')?.value;
  new WebSocket(`${BACKEND}/ws/chat?authorization={{${accessToken}}}`);
}
