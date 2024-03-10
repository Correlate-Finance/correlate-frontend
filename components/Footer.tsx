'use client';

import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="flex justify-items-center gap-4 text-xs md:text-base p-2 border-t-[2px] mt-4">
      <div className='md:w-1/4'>
        <p>2021 © Correlate</p>
        <p>All rights reserved</p>
      </div>

      <div className='md:w-1/4'>
        <Link href="/home">
          <p>Home</p>
        </Link>
        <Link href="/">
          <p>Web App</p>
        </Link>
        <Link href="/about">
          <p>About</p>
        </Link>
        <Link href="/contact">
          <p>Contact</p>
        </Link>
      </div>

      <div className='md:w-1/4'>
        <Link
          href="https://www.facebook.com/"
          target="_blank"
          rel="noreferrer noopener"
        >
          <p>Facebook</p>
        </Link>
        <Link href="https://www.instagram.com/" target="_blank" rel="noreferrer noopener">
          <p>Instagram</p>
        </Link>
        <Link href="https://www.twitter.com/" target="_blank" rel="noreferrer noopener">
          <p>Twitter</p>
        </Link>
        <Link href="https://www.linkedin.com/" target="_blank" rel="noreferrer noopener">
          <p>Linkedin</p>
        </Link>
      </div>

      <div className='md:w-1/4'>
        <Link href="/">
          <p>Privacy Policy</p>
        </Link>
        <Link href="/">
          <p>Term of Service</p>
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
