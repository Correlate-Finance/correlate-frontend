import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  console.log('In middleware');
  console.log('Current URL: ', request.url);

  const allowed = new RegExp(
    '/((?!login|register|reset-password|api|_next/static|_next/image|.*\\.png$).*)',
  );
  if (allowed.test(request.url)) {
    // Excel plugin requests are hitting the middleware so we need to manually check the url
    return;
  }

  const token = await getToken({ req: request });

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: [
    '/((?!login|register|reset-password|api|_next/static|_next/image|.*\\.png$).*)',
  ],
};
