'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import Logout from './Logout';
import ThemeSwitch from './ThemeSwitch';
import { Separator } from './ui/separator';

const Header = () => {
  const [loggedIn, setloggedIn] = useState(true);

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
        <Link href="/">
          <h1 className="text-[28px] dark:text-white mx-6">Correlate</h1>
        </Link>
        <ThemeSwitch />
        {loggedIn && <Logout />}
      </div>
      <Separator className="bg-neutral-700" />
    </header>
  );
};

export default Header;
