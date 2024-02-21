import { CorrelationData } from '@/components/Results';
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
  correlationMetric: z.string(),
});

export function useCorrelateResponseData() {
  const [correlateResponseData, setCorrelateResponseData] =
    useLocalStorage<CorrelationData>('correlateResponseData', {
      data: [],
      aggregationPeriod: '',
      correlationMetric: '',
    });
  return { correlateResponseData, setCorrelateResponseData };
}

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

export const useSubmitForm = (
  setCorrelateResponseData: (correlationData: CorrelationData) => void,
) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [hasData, setHasData] = useLocalStorage<boolean>('hasData', false);
  const { fetchRevenueData, revenueData } = useFetchRevenueData();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    fetchRevenueData(values);
    setLoading(true);
    const {
      ticker,
      startYear,
      aggregationPeriod,
      lagPeriods,
      highLevelOnly,
      correlationMetric,
    } = values;

    try {
      const urlParams = new URLSearchParams({
        stock: ticker,
        start_year: startYear.toString(),
        aggregation_period: aggregationPeriod,
        lag_periods: lagPeriods.toString(),
        high_level_only: highLevelOnly.toString(),
        correlation_metric: correlationMetric,
      });
      const res = await fetch(`api/fetch?${urlParams.toString()}`, {
        credentials: 'include',
      });
      const jsonData = await res.json();

      setLoading(false);
      const correlationData: CorrelationData = jsonData.data;
      setCorrelateResponseData(correlationData);
      setHasData(true);
    } catch (e) {
      alert('Error fetching data');
      setLoading(false);
      setHasData(false);
    }
  };

  return { onSubmit, loading, hasData, revenueData };
};

export const useCorrelateInputText = (
  setCorrelateResponseData: (correlationData: CorrelationData) => void,
) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [hasData, setHasData] = useLocalStorage<boolean>('hasData', false);
  const [lagPeriods] = useLocalStorage<number>('lagPeriods', 0);
  const [highLevelOnly] = useLocalStorage<boolean>('highLevelOnly', false);
  const [fiscalYearEnd, setFiscalYearEnd] = useState<string>('December');
  const [timeIncrement, setTimeIncrement] = useState<string>('Quarterly');
  const [correlateMetric, setCorrelateMetric] = useLocalStorage<string>(
    'correlate_metric',
    'RAW_VALUE',
  );

  const onChangeFiscalYearEnd = (e: string) => {
    setFiscalYearEnd(e);
  };

  const onChangeTimeIncrement = (e: string) => {
    setTimeIncrement(e);
  };

  const correlateInputText = async (inputData: string) => {
    setLoading(true);

    try {
      const urlParams = new URLSearchParams({
        fiscal_year_end: fiscalYearEnd,
        aggregation_period: timeIncrement,
        lag_periods: lagPeriods.toString(),
        high_level_only: highLevelOnly.toString(),
        correlation_metric: correlateMetric,
      });
      const res = await fetch(
        `api/correlateinputdata?${urlParams.toString()}`,
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
      const correlationData: CorrelationData = jsonData.data;
      setCorrelateResponseData(correlationData);
      setHasData(true);
    } catch (e) {
      alert('Error correlating data');
      setLoading(false);
      setHasData(false);
    }
  };

  return {
    correlateInputText,
    loading,
    hasData,
    onChangeFiscalYearEnd,
    onChangeTimeIncrement,
    correlateMetric,
    setCorrelateMetric,
  };
};
