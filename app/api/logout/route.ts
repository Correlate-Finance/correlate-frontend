import { type NextRequest } from 'next/server';
import { getBaseUrl } from '../util';
import { cookies } from 'next/headers';

export async function POST(_: NextRequest) {
  cookies().delete('session');
  return Response.json({ message: 'success' });
}
