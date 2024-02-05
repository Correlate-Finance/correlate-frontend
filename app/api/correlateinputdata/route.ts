import { type NextRequest } from 'next/server'
import { getBaseUrl } from '../util';

export async function POST(request: NextRequest) {
    const inputData = await request.text();
    const searchParams = request.nextUrl.searchParams
    const fiscalYearEnd = searchParams.get('fiscalYearEnd')

    const res = await fetch(`${getBaseUrl()}/correlateInputData/?fiscal_year_end=${fiscalYearEnd}`, {
        method: "POST",
        body: inputData,
        headers: {
          "Content-Type": "text/html; charset=utf-8",
        },
      });

    const data = await res.json()
   
    return Response.json({ data })
  }