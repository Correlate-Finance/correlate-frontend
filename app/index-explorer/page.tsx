'use client';

import { getAllIndices } from '@/app/api/actions';
import { IndexType } from '@/app/api/schema';
import SearchableIndexTable from '@/components/SearchableIndexTable';
import { Button } from '@/components/ui/button';
import { Calculator } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const IndexExplorerPage = () => {
  const [data, setData] = useState<IndexType[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      const fetchedData = await getAllIndices();
      setData(fetchedData);
    };

    fetchData();
  }, []);

  if (data.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center w-full min-h-[80vh]">
        <Calculator />
        <h1 className="text-4xl text-center font-bold">
          You don&apos;t have any indexes yet
        </h1>
        <p className="w-[40%] text-center">
          Get started by going to the Dataset Explorer page to create your first
          index.
        </p>
        <Link href="/table-explorer">
          <Button className="my-6">Dataset Explorer</Button>
        </Link>
      </div>
    );
  }

  return <SearchableIndexTable data={data} />;
};

export default IndexExplorerPage;
