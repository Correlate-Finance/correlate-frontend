import { type NextRequest } from 'next/server'
import { getBaseUrl } from '../util'

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const stock = searchParams.get('stock')
    const startYear = searchParams.get('startYear')
    const aggregationPeriod = searchParams.get('aggregationPeriod')
    const lagPeriods = searchParams.get('lagPeriods')
    
    const res = await fetch(`${getBaseUrl()}/correlate?stock=${stock}&startYear=${startYear}&aggregationPeriod=${aggregationPeriod}&lag_periods=${lagPeriods}`)
    const data = await res.json()
   
    return Response.json({ data })
  }