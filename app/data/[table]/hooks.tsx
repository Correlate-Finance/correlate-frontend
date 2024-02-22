import { DataTrendPoint } from '@/app/api/schema';
import handleResponseStatus from '@/lib/handleResponse';
import dayjs from 'dayjs';
import { useEffect, useMemo, useState } from 'react';

type Tparams = {
  table: string;
};
// Custom hook for fetching data
export const useFetchData = (params: Tparams) => {
  const [data, setData] = useState<DataTrendPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/dataset/`, {
      method: 'POST',
      body: params.table,
    })
      .then((res) => handleResponseStatus(res))
      .then((json) => setData(JSON.parse(json.data).toReversed()))
      .catch((err) => {
        setData([]);
      })
      .finally(() => setLoading(false));
  }, [params.table]);

  return { data, loading };
};

// Custom hook for filtering data
export const useFilterData = (data: DataTrendPoint[]) => {
  const filteredDataRaw = useMemo(() => {
    return data;
  }, [data]);

  const filteredDataSeasonal = useMemo(() => {
    return data;
  }, [data]);

  return { filteredDataRaw, filteredDataSeasonal };
};

// Custom hook for generating last five years array
export const useAllYearsArray = (data: DataTrendPoint[]) => {
  return useMemo(() => {
    const years = [];
    for (let i = 0; i < data.length / 12; i++) {
      years.push(dayjs(data[0].Date).subtract(i, 'year').format('YYYY'));
    }
    return years;
  }, [data]);
};
