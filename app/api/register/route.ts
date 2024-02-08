import { type NextRequest } from 'next/server';
import { getBaseUrl } from '../util';

export async function POST(request: NextRequest) {
  console.log(request);
  const searchParams = request.nextUrl.searchParams;
  const body = await request.json();

  console.log('register');
  console.log(body);

  const res = await fetch(`${getBaseUrl()}/users/register/`, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data = await res.json();

  console.log(data);

  return Response.json({ data });
}
