'use client';

import { getBaseUrl } from '@/app/api/util';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';

const Logout = () => {
  const router = useRouter();
  const session = useSession();

  async function logout() {
    try {
      const res = await fetch(`${getBaseUrl()}/users/logout/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${session.data?.user.accessToken}`,
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
    } catch (error) {
      // do nothing
    }

    signOut({ redirect: false });
    router.push('/login');
  }

  return (
    <Button className="mx-8 bg-blue-800 my-1 text-white" onClick={logout}>
      Logout
    </Button>
  );
};

export default Logout;
