import { headers } from 'next/headers';
import { type NextRequest } from 'next/server';
import { getBaseUrl } from '../util';

export async function POST(request: NextRequest) {
  const tableName = await request.text();

  const res = await fetch(`${getBaseUrl()}/dataset/`, {
    method: 'POST',
    body: tableName,
    headers: headers(),
    credentials: 'include',
  });

  const data = await res.json();
  return Response.json({ data });
}
