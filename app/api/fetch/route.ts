import { type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const stock = searchParams.get('stock')
    
    const res = await fetch(`https://correlate-backend-e2905dab5cac.herokuapp.com/correlate/?stock=${stock}`)
    const data = await res.json()
   
    return Response.json({ data })
  }