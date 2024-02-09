'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import Logout from './Logout';
import { Separator } from './ui/separator';

const Header = () => {
  const [loggedIn, setloggedIn] = useState(true);

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      setloggedIn(localStorage.getItem('loggedIn') === 'true');
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  return (
    <header className="flex-row justify-items-center">
      <div className="flex flex-row justify-between items-center">
        <Link href="/">
          <h1 className="text-[28px] text-white mx-6">Correlate</h1>
        </Link>
        {loggedIn && <Logout />}
      </div>
      <Separator className="bg-neutral-700" />
    </header>
  );
};

export default Header;
