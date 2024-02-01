import { type NextRequest } from 'next/server'
import { getBaseUrl } from '../util';

export async function POST(request: NextRequest) {
    const inputData = await request.text();
    console.log(`${getBaseUrl()}/correlateInputData/`);
    const res = await fetch(`${getBaseUrl()}/correlateInputData/`, {
        method: "POST",
        body: inputData,
        headers: {
          "Content-Type": "text/html; charset=utf-8",
        },
      });
    console.log(res)
    const data = await res.json()
   
    return Response.json({ data })
  }