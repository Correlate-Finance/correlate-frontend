import { headers } from 'next/headers';
import { type NextRequest } from 'next/server';
import { getBaseUrl } from '../util';

export async function POST(request: NextRequest) {
  const inputData = await request.text();
  const searchParams = request.nextUrl.searchParams;

  try {
    const res = await fetch(
      `${getBaseUrl()}/correlateInputData/?${searchParams.toString()}`,
      {
        method: 'POST',
        body: inputData,
        headers: headers(),
        credentials: 'include',
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
