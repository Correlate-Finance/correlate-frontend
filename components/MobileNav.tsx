'use client';

import { Cross1Icon } from '@radix-ui/react-icons';
import Link from 'next/link';

type TProps = {
  isViewed: boolean;
  onClose: () => void;
};

const navLinks = [
  { name: 'Welcome', href: '/' },
  { name: 'Web app', href: '/' },
  { name: 'About us', href: '/about' },
  { name: 'Contact us', href: '/contact' },
];

const MobileNav = ({ isViewed, onClose }: TProps) => {
  return (
    isViewed && (
      <div className="flex flex-col w-full h-full bg-gray-300 absolute top-0 left-0 z-50">
        <button
          className="flex justify-end m-4 text-black"
          onClick={() => onClose()}
        >
          <Cross1Icon className="w-10 h-10 cursor-pointer" />
        </button>
        <div className="flex flex-col h-full m-4 text-black">
          {navLinks.map((link) => (
            <Link key={link.name} href={link.href} onClick={() => onClose()}>
              <p className="text-2xl font-semibold mb-5">{link.name}</p>
            </Link>
          ))}
        </div>
      </div>
    )
  );
};

export default MobileNav;
