'use client';

import DarkModeLogo from '@/assets/DarkModeLogo';
import LightModeLogo from '@/assets/LightModeLogo';
import { useSession } from 'next-auth/react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import Logout from './Logout';
import ThemeSwitch from './ThemeSwitch';
import { Separator } from './ui/separator';

const Header = () => {
  const session = useSession();
  const { resolvedTheme } = useTheme();

  return (
    <header className="flex-row justify-items-center">
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-row justify-start items-center">
          <Link href="/">
            <div>
              {resolvedTheme === 'dark' && <DarkModeLogo className="h-6" />}
              {resolvedTheme === 'light' && <LightModeLogo className="h-6" />}
            </div>
          </Link>
          <Link href="/">
            <h2 className="text-[16px] mx-6">Home</h2>
          </Link>
          <Link href="/table-explorer">
            <h2 className="text-[16px] mx-6">Dataset Explorer</h2>
          </Link>
          <Link href="/index-explorer">
            <h2 className="text-[16px] mx-6">Index Explorer</h2>
          </Link>
        </div>
        <div className="flex flex-row justify-end w-1/5 items-center gap-4 mr-2">
          <ThemeSwitch />
          {session.status === 'authenticated' && <Logout />}
        </div>
      </div>
      <Separator className="bg-neutral-700" />
    </header>
  );
};

export default Header;
