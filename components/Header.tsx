'use client';

import { TextAlignJustifyIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Logout from './Logout';
import MobileNav from './MobileNav';
import ThemeSwitch from './ThemeSwitch';
import { Separator } from './ui/separator';

const Header = () => {
  const [loggedIn, setloggedIn] = useState(true);
  const [isViewed, setIsViewed] = useState(false);

  useEffect(() => {
    const handleStorage = () => {
      setloggedIn(localStorage.getItem('loggedIn') === 'true');
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  return (
    <header className="flex-row justify-items-center">
      <div className="flex flex-row justify-between items-center">
        <button className="md:hidden" onClick={() => setIsViewed(true)}>
          <TextAlignJustifyIcon className="cursor-pointer w-10 h-10 ml-2" />
        </button>
        <Link href="/">
          <h1 className="text-[28px] mx-6">Correlate</h1>
        </Link>
        <div className="flex flex-row gap-4 justify-end md:w-1/5 items-center">
          <ThemeSwitch />
          {loggedIn && <Logout />}
        </div>
      </div>
      <Separator className="bg-neutral-700" />
      <MobileNav isViewed={isViewed} onClose={() => setIsViewed(false)} />
    </header>
  );
};

export default Header;
