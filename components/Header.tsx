import React from 'react';
import { Separator } from './ui/separator';
import Logout from './Logout';
import { cookies } from 'next/headers';

const Header = () => {
  const logged_in = cookies().get('logged_in')?.value === 'true';

  return (
    <header className="flex-row justify-items-center">
      <div className="flex flex-row justify-between items-center">
        <h1 className="text-[28px] text-white mx-6">Correlate</h1>
        {logged_in && <Logout />}
      </div>
      <Separator className="bg-neutral-700" />
    </header>
  );
};

export default Header;
