'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';

type ErrorBoundaryProps = {
  error: Error;
  reset: () => void;
};

export default function ErrorBoundary({ error, reset }: ErrorBoundaryProps) {
  return (
    <div>
      <h1 className="text-white text-center text-4xl font-bold mt-20">
        There was a problem
      </h1>
      <h3 className="text-white text-center text-2xl font-bold mt-20">
        {error.message || 'Something went wrong'}
      </h3>
      <p className="text-white text-center text-xl mt-8">
        Please try again later and if the problem persists, contact support.
      </p>
      <div className="flex justify-center space-x-4 mt-8">
        <Button className="bg-blue-800" onClick={reset}>
          Try Again
        </Button>
        <Button variant="secondary">
          <Link href="/">Go back to home</Link>
        </Button>
      </div>
    </div>
  );
}
