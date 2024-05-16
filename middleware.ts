import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  // const allowed = new RegExp(
  //   '/((?=login|register|reset-password|api|_next/static|_next/image|.*\\.png$|static/|/__nextjs_original-stack-frame|favicon.ico).*)',
  // );
  // const url = new URL(request.url);
  // console.log('Allowed: ', url.pathname, allowed.test(url.pathname));

  // if (allowed.test(url.pathname)) {
  //   // Excel plugin requests are hitting the middleware so we need to manually check the url
  //   return;
  // }

  const token = await getToken({ req: request });

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: [
    '/((?!login|register|reset-password|api|_next/static|static/|_next/image|.*\\.png$).*)',
  ],
};
