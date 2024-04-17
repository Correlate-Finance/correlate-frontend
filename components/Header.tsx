'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Logout from './Logout';
import ThemeSwitch from './ThemeSwitch';
import { Separator } from './ui/separator';

const Header = () => {
  const session = useSession();

  return (
    <header className="flex-row justify-items-center">
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-row justify-start items-center">
          <Link href="/">
            <h1 className="text-[28px] mx-6">Correlate</h1>
          </Link>
          <Link href="/">
            <h2 className="text-[18px] mx-6">Home</h2>
          </Link>
          <Link href="/table-explorer">
            <h2 className="text-[18px] mx-6">Dataset Explorer</h2>
          </Link>
          <Link href="/index-explorer">
            <h2 className="text-[18px] mx-6">Index Explorer</h2>
          </Link>
        </div>
        <div className="flex flex-row justify-end w-1/5 items-center mr-6">
          <ThemeSwitch />
          {session.status === 'authenticated' && <Logout />}
        </div>
      </div>
      <Separator className="bg-neutral-700" />
    </header>
  );
};

export default Header;
