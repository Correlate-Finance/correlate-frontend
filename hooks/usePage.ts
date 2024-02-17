import { CorrelationDataPoint } from '@/components/Results';
import { useState } from 'react';
import { z } from 'zod';
import { useLocalStorage } from './useLocalStorage';

export const formSchema = z.object({
  ticker: z.string().min(1, {
    message: 'Stock Ticker must be at least 1 character long.',
  }),
  startYear: z.coerce
    .number()
    .max(2023, { message: 'Year needs to be lower than 2023' })
    .min(2000, { message: 'Year needs to be higher than 2000' }),
  aggregationPeriod: z.string(),
  lagPeriods: z.coerce.number(),
  highLevelOnly: z.boolean().default(false),
});

export function useFetchRevenueData() {
  const [revenueData, setRevenueData] = useLocalStorage<string[][]>(
    'revenueData',
    [],
  );
  const [loading, setLoading] = useState(false);

  const fetchRevenueData = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);

    try {
      const response = await fetch(
        `api/revenue?stock=${values.ticker}&startYear=${values.startYear}&aggregationPeriod=${values.aggregationPeriod}`,
        {
          credentials: 'include',
        },
      );
      const jsonData = await response.json();
      const parsedData = jsonData.data.map((x: any) => [x.date, x.value]);
      setRevenueData(parsedData);
    } catch (e) {
      alert('Error fetching revenue data');
      setRevenueData([]);
    } finally {
      setLoading(false);
    }
  };

  return { revenueData, loading, fetchRevenueData };
}

export const useSubmitForm = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [dataArray, setDataArray] = useLocalStorage<CorrelationDataPoint[]>(
    'dataArray',
    [],
  );
  const [hasData, setHasData] = useLocalStorage<boolean>('hasData', false);
  const { fetchRevenueData, revenueData } = useFetchRevenueData();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    fetchRevenueData(values);
    setLoading(true);
    const { ticker, startYear, aggregationPeriod, lagPeriods, highLevelOnly } =
      values;

    try {
      const res = await fetch(
        `api/fetch?stock=${ticker}&startYear=${startYear}&aggregationPeriod=${aggregationPeriod}&lagPeriods=${lagPeriods}&highLevelOnly=${highLevelOnly}`,
        {
          credentials: 'include',
        },
      );
      const jsonData = await res.json();

      setLoading(false);
      const arrData: CorrelationDataPoint[] = jsonData.data.data;
      setDataArray(arrData);
      setHasData(true);
    } catch (e) {
      alert('Error fetching data');
      setLoading(false);
      setDataArray([]);
      setHasData(false);
    }
  };

  return { onSubmit, loading, dataArray, hasData, revenueData };
};

export const useCorrelateInputText = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [dataArray, setDataArray] = useLocalStorage<CorrelationDataPoint[]>(
    'dataArray',
    [],
  );
  const [hasData, setHasData] = useLocalStorage<boolean>('hasData', false);
  const [lagPeriods] = useLocalStorage<number>('lagPeriods', 0);
  const [highLevelOnly] = useLocalStorage<boolean>('highLevelOnly', false);
  const [fiscalYearEnd, setFiscalYearEnd] = useState<string>('December');
  const [timeIncrement, setTimeIncrement] = useState<string>('Quarterly');

  const onCHangeFiscalYearEnd = (e: string) => {
    setFiscalYearEnd(e);
  };

  const onChangeTimeIncrement = (e: string) => {
    setTimeIncrement(e);
  };

  const correlateInputText = async (inputData: string) => {
    setLoading(true);

    try {
      const res = await fetch(
        `api/correlateinputdata?fiscalYearEnd=${fiscalYearEnd}&timeIncrement=${timeIncrement}&lagPeriods=${lagPeriods}&highLevelOnly=${highLevelOnly}`,
        {
          method: 'POST',
          body: inputData,
          headers: {
            'Content-Type': 'text/html; charset=utf-8',
          },
          credentials: 'include',
        },
      );

      const jsonData = await res.json();

      setLoading(false);
      const arrData: CorrelationDataPoint[] = jsonData.data.data;
      setDataArray(arrData);
      setHasData(true);
    } catch (e) {
      alert('Error correlating data');
      setLoading(false);
      setDataArray([]);
      setHasData(false);
    }
  };

  return {
    correlateInputText,
    loading,
    dataArray,
    hasData,
    onCHangeFiscalYearEnd,
    onChangeTimeIncrement,
  };
};
