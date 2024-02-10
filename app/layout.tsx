import Header from '@/components/Header';
import type { Metadata } from 'next';
import React from 'react';
// import { Inter } from 'next/font/google';
import './globals.css';

// TODO: Remove the unused variable assignment
// const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Correlate',
  description: 'Find the best data to suit your needs',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen font-poppins bg-[#131319]">
        <Header />
        {children}
      </body>
    </html>
  );
}
