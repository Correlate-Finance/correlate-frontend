import { headers } from 'next/headers';
import { type NextRequest } from 'next/server';
import { getBaseUrl } from '../util';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const stock = searchParams.get('stock');
  const startYear = searchParams.get('startYear');
  const aggregationPeriod = searchParams.get('aggregationPeriod');
  const lagPeriods = searchParams.get('lagPeriods');

  try {
    const res = await fetch(
      `${getBaseUrl()}/correlate?stock=${stock}&startYear=${startYear}&aggregationPeriod=${aggregationPeriod}&lag_periods=${lagPeriods}`,
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
    alert('Error: ' + error);
    return Promise.reject(error);
  }
}
