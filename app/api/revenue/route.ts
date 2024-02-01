import { type NextRequest } from 'next/server'
import { getBaseUrl } from '../util'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const stock = searchParams.get('stock')
    const startYear = searchParams.get('startYear')
    
    const res = await fetch(`${getBaseUrl()}/revenue?stock=${stock}&startYear=${startYear}`)
    const data = await res.json()
    
    console.log(data)
   
    return Response.json({ data })
}