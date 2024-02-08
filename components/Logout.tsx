'use client';

import React from 'react';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';

const Logout = () => {
  const router = useRouter();

  function logout() {
    fetch('api/logout', { method: 'POST' });
    router.push('/login');
  }

  return (
    <Button className="mx-8 bg-blue-800 my-1" onClick={logout}>
      Logout
    </Button>
  );
};

export default Logout;
