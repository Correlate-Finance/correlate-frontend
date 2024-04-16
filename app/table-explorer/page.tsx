'use client';

import { getAllDatasetMetadata } from '@/app/api/actions';
import SearchableTable from '@/components/SearchableTable';
import { useEffect, useState } from 'react';
import { DatasetMetadata } from '../api/schema';

const TableExplorerPage = () => {
  const [data, setData] = useState<DatasetMetadata[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      const fetchedData = await getAllDatasetMetadata();
      setData(fetchedData);
    };

    fetchData();
  }, []);

  return <SearchableTable data={data} />;
};

export default TableExplorerPage;
