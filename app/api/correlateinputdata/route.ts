import { authOptions } from '@/lib/configs/authOptions';
import { getServerSession } from 'next-auth/next';
import { NextRequest } from 'next/server';
import { getBaseUrl } from '../util';

export async function POST(request: NextRequest) {
  const inputData = await request.text();
  const searchParams = request.nextUrl.searchParams;
  const session = await getServerSession(authOptions);

  if (!session) {
    return Response.json({ error: 'Unauthorized', status: 401 });
  }

  try {
    const res = await fetch(
      `${getBaseUrl()}/correlate-input-data/?${searchParams.toString()}`,
      {
        method: 'POST',
        body: inputData,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${session.user.accessToken}`,
        },
      },
    );

    if (!res.ok) {
      return new Response(JSON.stringify({ error: res.statusText }), {
        status: res.status,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    const data = await res.json();

    return Response.json({ data });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
