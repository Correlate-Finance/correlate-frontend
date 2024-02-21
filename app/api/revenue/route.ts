import { headers } from 'next/headers';
import { type NextRequest } from 'next/server';
import { getBaseUrl } from '../util';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const stock = searchParams.get('stock');
  const startYear = searchParams.get('startYear');
  const aggregationPeriod = searchParams.get('aggregationPeriod');

  try {
    const res = await fetch(
      `${getBaseUrl()}/revenue?stock=${stock}&startYear=${startYear}&aggregationPeriod=${aggregationPeriod}`,
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
