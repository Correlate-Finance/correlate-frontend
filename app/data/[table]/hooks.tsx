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
export const useFilterData = (data: DataTrendPoint[], selectedYear: string) => {
  const filteredDataRaw = useMemo(() => {
    return data;
  }, [data]);

  const filteredDataSeasonal = useMemo(() => {
    if (selectedYear === 'all') {
      return data;
    }
    return data.filter((dp) => {
      return dayjs(dp.Date).format('YYYY') === selectedYear;
    });
  }, [data, selectedYear]);

  return { filteredDataRaw, filteredDataSeasonal };
};

// Custom hook for generating last five years array
export const useLastFiveYearsArray = () => {
  return useMemo(() => {
    const lastFiveYears = [];
    for (let i = 0; i < 5; i++) {
      lastFiveYears.push(dayjs().subtract(i, 'year').format('YYYY'));
    }
    return lastFiveYears;
  }, []);
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
