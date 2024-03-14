import Header from '@/components/Header';
import type { Metadata } from 'next';
import React from 'react';
// import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';
import { authOptions } from '@/lib/configs/authOptions';
import { getServerSession } from 'next-auth/next';
import './globals.css';
import { Providers } from './providers';

// TODO: Remove the unused variable assignment
// const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Correlate',
  description: 'Find the best data to suit your needs',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen font-poppins dark:bg-[#131319]">
        <Providers session={session}>
          <Header />
          <Toaster />
          {children}
        </Providers>
      </body>
    </html>
  );
}
