'use client';

import React from 'react';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';
import { getBaseUrl } from '@/app/api/util';

const Logout = () => {
  const router = useRouter();

  function logout() {
    fetch(`${getBaseUrl()}/users/logout/`, {
      method: 'POST',
      credentials: 'include',
    });
    localStorage.setItem('loggedIn', 'false');
    window.dispatchEvent(new Event('storage'));
    router.push('/login');
  }

  return (
    <Button className="mx-8 bg-blue-800 my-1" onClick={logout}>
      Logout
    </Button>
  );
};

export default Logout;
