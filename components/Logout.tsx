'use client';

import { getBaseUrl } from '@/app/api/util';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';

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
