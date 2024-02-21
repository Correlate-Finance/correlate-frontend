import { headers } from 'next/headers';
import { type NextRequest } from 'next/server';
import { getBaseUrl } from '../util';

export async function POST(request: NextRequest) {
  try {
    const tableName = await request.text();

    const res = await fetch(`${getBaseUrl()}/dataset/`, {
      method: 'POST',
      body: tableName,
      headers: headers(),
      credentials: 'include',
    });

    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }

    const data = await res.json();
    return Response.json({ data });
  } catch (error) {
    return Promise.reject(error);
  }
}
