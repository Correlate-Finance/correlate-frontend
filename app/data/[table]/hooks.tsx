import { DataTrendPoint } from '@/app/api/schema';
import dayjs from 'dayjs';
import { useEffect, useMemo, useState } from 'react';

type Tparams = {
  table: string;
};
// Custom hook for fetching data
export const useFetchData = (params: Tparams) => {
  const [data, setData] = useState<DataTrendPoint[]>([]);

  useEffect(() => {
    fetch(`/api/dataset/`, {
      method: 'POST',
      body: params.table,
    })
      .then((res) => res.json())
      .then((json) => setData(JSON.parse(json.data).toReversed()))
      .catch((err) => {
        alert('Error: ' + err);
      });
  }, [params.table]);

  return data;
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

export const useLocalStorage = (key: string, initialValue: string) => {
  const [storedValue, setStoredValue] = useState(initialValue);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const item = window.localStorage.getItem(key);
      setStoredValue(item ?? initialValue);
    }
  }, [key, initialValue]);

  const setValue = (value: string) => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(key, value);
    }
    setStoredValue(value);
  };

  return [storedValue, setValue] as const;
};
