import { headers } from 'next/headers';
import { type NextRequest } from 'next/server';
import { getBaseUrl } from '../util';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  try {
    const res = await fetch(
      `${getBaseUrl()}/correlate?${searchParams.toString()}`,
      {
        headers: headers(),
        credentials: 'include',
      },
    );

    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }

    const data = await res.json();

    return Response.json({ data });
  } catch (error) {
    return Promise.reject(error);
  }
}
