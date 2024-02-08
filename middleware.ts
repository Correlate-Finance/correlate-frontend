import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  console.log(request.cookies);
  const currentUser = request.cookies.get('session')?.value;

  if (!currentUser) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  // } else {
  //   return NextResponse.next();
  // }
}

export const config = {
  matcher: [
    '/((?!login|register|api|_next/static|_next/image|.*\\.png$).*)',
  ],
};
