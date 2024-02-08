import { type NextRequest } from 'next/server';
import { getBaseUrl } from '../util';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  const body = await request.json();

  const res = await fetch(`${getBaseUrl()}/users/login/`, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data = await res.json();

  cookies().set({ name: 'logged_in', value: 'true' });
  cookies().set({
    name: 'session',
    value: data.token,
    httpOnly: true,
  });
  cookies().set({
    name: 'session',
    value: data.token,
    httpOnly: true,
  });
  return Response.json({ data });
}
