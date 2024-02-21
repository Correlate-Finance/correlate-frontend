import { type NextRequest } from 'next/server';
import { getBaseUrl } from '../util';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const res = await fetch(`${getBaseUrl()}/users/register/`, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
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
