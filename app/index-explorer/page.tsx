'use client';

import { getAllIndices } from '@/app/api/actions';
import SearchableIndexTable from '@/components/SearchableIndexTable';
import { useEffect, useState } from 'react';

const IndexExplorerPage = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const fetchedData = await getAllIndices();
      setData(fetchedData);
    };

    fetchData();
  }, []);

  return <SearchableIndexTable data={data} />;
};

export default IndexExplorerPage;
