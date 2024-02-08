import { type NextRequest } from 'next/server';
import { getBaseUrl } from '../util';
import { headers } from 'next/headers';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const stock = searchParams.get('stock');
  const startYear = searchParams.get('startYear');
  const aggregationPeriod = searchParams.get('aggregationPeriod');
  const lagPeriods = searchParams.get('lagPeriods');

  console.log(request.cookies);

  const res = await fetch(
    `${getBaseUrl()}/correlate?stock=${stock}&startYear=${startYear}&aggregationPeriod=${aggregationPeriod}&lag_periods=${lagPeriods}`,
    {
      headers: headers(),
      credentials: 'include',
    }
  );
  const data = await res.json();

  return Response.json({ data });
}
