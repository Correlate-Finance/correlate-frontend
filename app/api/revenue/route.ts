import { headers } from 'next/headers';
import { type NextRequest } from 'next/server';
import { getBaseUrl } from '../util';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const stock = searchParams.get('stock');
  const startYear = searchParams.get('startYear');
  const aggregationPeriod = searchParams.get('aggregationPeriod');

  const res = await fetch(
    `${getBaseUrl()}/revenue?stock=${stock}&startYear=${startYear}&aggregationPeriod=${aggregationPeriod}`,
    {
      credentials: 'include',
      headers: headers(),
    },
  );
  const data = await res.json();

  return Response.json({ data });
}
