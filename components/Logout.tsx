'use client';

import { getBaseUrl } from '@/app/api/util';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';

const Logout = () => {
  const router = useRouter();

  async function logout() {
    try {
      const res = await fetch(`${getBaseUrl()}/users/logout/`, {
        method: 'POST',
        credentials: 'include',
      });
      localStorage.setItem('loggedIn', 'false');
      window.dispatchEvent(new Event('storage'));
      Cookies.remove('session');
      router.push('/login');
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
    } catch (error) {
      // do nothing
    }
  }

  return (
    <Button className="md:mx-8 bg-blue-800 my-1 text-white" onClick={logout}>
      Logout
    </Button>
  );
};

export default Logout;
