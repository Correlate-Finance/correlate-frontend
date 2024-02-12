import { headers } from 'next/headers';
import { type NextRequest } from 'next/server';
import { getBaseUrl } from '../util';

export async function POST(request: NextRequest) {
  const inputData = await request.text();
  const searchParams = request.nextUrl.searchParams;
  const fiscalYearEnd = searchParams.get('fiscalYearEnd');
  const timeIncrement = searchParams.get('timeIncrement');
  const lagPeriods = searchParams.get('lagPeriods');
  const highLevelOnly = searchParams.get('highLevelOnly');

  try {
    const res = await fetch(
      `${getBaseUrl()}/correlateInputData/?fiscal_year_end=${fiscalYearEnd}&time_increment=${timeIncrement}&lag_periods=${lagPeriods}&high_level_only=${highLevelOnly}`,
      {
        method: 'POST',
        body: inputData,
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
