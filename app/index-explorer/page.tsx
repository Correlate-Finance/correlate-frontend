'use client';

import { getAllDatasetMetadata } from '@/app/api/actions';
import SearchableTable from '@/components/SearchableTable';
import { useEffect, useState } from 'react';

const IndexExplorerPage = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const fetchedData = await getAllDatasetMetadata();
      setData(fetchedData);
    };

    fetchData();
  }, []);

  return <SearchableTable data={data} />;
};

export default IndexExplorerPage;
