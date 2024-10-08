'use client';

import { getAllDatasetMetadata } from '@/app/api/actions';
import SearchableTable from '@/components/SearchableTable';
import { useEffect, useState } from 'react';
import { DatasetMetadataType } from '../api/schema';

const TableExplorerPage = () => {
  const [data, setData] = useState<DatasetMetadataType[]>([]);
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
