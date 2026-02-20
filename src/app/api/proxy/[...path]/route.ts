import { NextRequest } from 'next/server';
import { route } from 'shared/api/session';

export async function GET(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }): Promise<Response> {
  const resolvedParams = await params;
  return route(req, resolvedParams.path);
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }): Promise<Response> {
  const resolvedParams = await params;
  return route(req, resolvedParams.path);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }): Promise<Response> {
  const resolvedParams = await params;
  return route(req, resolvedParams.path);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }): Promise<Response> {
  const resolvedParams = await params;
  return route(req, resolvedParams.path);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }): Promise<Response> {
  const resolvedParams = await params;
  return route(req, resolvedParams.path);
}

// import { cookies } from 'next/headers';
// import { NextRequest, NextResponse } from 'next/server';

// const BACKEND = process.env.BACKEND_API_URL!;

// export default async function handler(req: NextRequest): Promise<NextResponse> {
//   const cookieStore = await cookies();
//   const accessToken = cookieStore.get('access')?.value;

//   if (!accessToken) {
//     return NextResponse.json({ error: 'Access token is missing' }, { status: 401 });
//   }
//   return NextResponse.json({ url: `${BACKEND}/ws/chat?authorization=${accessToken}` });
// }
