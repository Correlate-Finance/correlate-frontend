import { type NextRequest } from 'next/server'
import { getBaseUrl } from '../util'

import { z } from 'zod';

const DataPointSchema = z.object({
  date: z
    .string({
      required_error: 'Date is required',
    })
    .trim()
    .min(1, 'Date cannot be empty'),
  value: z
    .number({
      required_error: 'Value is required',
    })
});

export const DataPointsSchema = z.array(DataPointSchema)

export type DataPoint = z.infer<typeof DataPointSchema>;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const stock = searchParams.get('stock')
    const startYear = searchParams.get('startYear')
    
    const res = await fetch(`${getBaseUrl()}/revenue?stock=${stock}&startYear=${startYear}`)
    const data = await res.json()
    
    console.log(data)
   
    return Response.json({ data })
}