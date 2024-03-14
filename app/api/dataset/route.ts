import { authOptions } from '@/lib/configs/authOptions';
import { getServerSession } from 'next-auth/next';
import { type NextRequest } from 'next/server';
import { getBaseUrl } from '../util';

export async function POST(request: NextRequest) {
  try {
    const tableName = await request.text();
    const session = await getServerSession(authOptions);

    if (!session) {
      return Response.json({ error: 'Unauthorized', status: 401 });
    }

    const res = await fetch(`${getBaseUrl()}/dataset/`, {
      method: 'POST',
      body: tableName,
      headers: {
        Authorization: `Token ${session.user.accessToken}`,
        'Content-Type': 'application/json',
      },
    });

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
