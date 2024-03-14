import { authOptions } from '@/lib/configs/authOptions';
import { getServerSession } from 'next-auth/next';
import { type NextRequest } from 'next/server';
import { getBaseUrl } from '../util';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const stock = searchParams.get('stock');
  const startYear = searchParams.get('startYear');
  const aggregationPeriod = searchParams.get('aggregationPeriod');

  const session = await getServerSession(authOptions);

  if (!session) {
    return Response.json({ error: 'Unauthorized', status: 401 });
  }

  try {
    const res = await fetch(
      `${getBaseUrl()}/revenue?stock=${stock}&startYear=${startYear}&aggregationPeriod=${aggregationPeriod}`,
      {
        headers: {
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
