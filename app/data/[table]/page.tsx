'use client';

import { useRouter } from 'next/navigation';

export default function Page({ params }: { params: { table: string } }) {
  const router = useRouter();
  return <p className="text-white">Post: {decodeURIComponent(params.table)}</p>;
}
