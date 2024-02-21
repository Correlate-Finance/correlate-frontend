import { CorrelationData } from '@/components/Results';
import { useState } from 'react';
import { z } from 'zod';
import { useLocalStorage } from './useLocalStorage';

export const formSchema = z.object({
  ticker: z.string().optional(),
  inputData: z.string().optional(),
  startYear: z.coerce
    .number()
    .max(2023, { message: 'Year needs to be lower than 2023' })
    .min(2000, { message: 'Year needs to be higher than 2000' }),
  fiscalYearEnd: z.string().optional().default('December'),
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

  const onSubmit = async (inputFields: z.infer<typeof formSchema>) => {
    fetchRevenueData(inputFields);
    setLoading(true);
    const {
      ticker,
      startYear,
      aggregationPeriod,
      lagPeriods,
      highLevelOnly,
      correlationMetric,
    } = inputFields;

    try {
      const urlParams = new URLSearchParams({
        start_year: startYear.toString(),
        aggregation_period: aggregationPeriod,
        lag_periods: lagPeriods.toString(),
        high_level_only: highLevelOnly.toString(),
        correlation_metric: correlationMetric,
      });
      if (ticker) {
        urlParams.append('stock', ticker);
      }
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

  const correlateInputText = async (
    inputFields: z.infer<typeof formSchema>,
  ) => {
    if (!inputFields.inputData) {
      alert('No input data');
      return;
    }

    setLoading(true);
    try {
      const urlParams = new URLSearchParams({
        fiscal_year_end: inputFields.fiscalYearEnd,
        aggregation_period: inputFields.aggregationPeriod,
        lag_periods: inputFields.lagPeriods.toString(),
        high_level_only: inputFields.highLevelOnly.toString(),
        correlation_metric: inputFields.correlationMetric,
      });
      const res = await fetch(
        `api/correlateinputdata?${urlParams.toString()}`,
        {
          method: 'POST',
          body: inputFields.inputData,
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
  };
};
