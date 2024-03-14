// app/api/auth/[...nextauth].ts

import { authOptions } from '@/lib/configs/authOptions';
import NextAuth from 'next-auth/next';

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
