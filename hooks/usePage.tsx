import { getCompanySegments } from '@/app/api/actions';
import { CorrelationData } from '@/components/Results';
import handleResponseStatus from '@/lib/handleResponse';
import { useState } from 'react';
import { z } from 'zod';
import { useLocalStorage } from './useLocalStorage';

export const inputFieldsSchema = z.object({
  ticker: z.string().optional(),
  inputData: z.string().optional(),
  startYear: z.coerce
    .number()
    .max(2023, { message: 'Year needs to be lower than 2023' })
    .min(2000, { message: 'Year needs to be higher than 2000' }),
  endYear: z.coerce.number().min(2000),
  fiscalYearEnd: z.string().optional().default('December'),
  aggregationPeriod: z.string(),
  lagPeriods: z.coerce.number(),
  highLevelOnly: z.boolean().default(false),
  correlationMetric: z.string(),
  segment: z.string().optional(),
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

  const fetchRevenueData = async (
    values: z.infer<typeof inputFieldsSchema>,
  ) => {
    setLoading(true);
    setRevenueData([]);

    try {
      if (values.segment === 'Total Revenue') {
        const response = await fetch(
          `api/revenue?stock=${values.ticker}&start_year=${values.startYear}&aggregation_period=${values.aggregationPeriod}${values.endYear ? `&end_year=${values.endYear}` : ''}`,
        );
        const jsonData = await handleResponseStatus(response);
        const parsedData = jsonData.data.map((x: any) => [x.date, x.value]);
        setRevenueData(parsedData);
      } else {
        const response = await getCompanySegments(values);
        const filteredData = response.filter(
          (x: any) => x.segment == values.segment,
        );
        const parsedData = filteredData[0].data.map((x: any) => [
          x.date,
          x.value,
        ]);
        setRevenueData(parsedData);
      }
    } catch (e) {
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

  const onSubmit = async (
    inputFields: z.infer<typeof inputFieldsSchema>,
    selected_datasets?: Array<string>,
  ) => {
    fetchRevenueData(inputFields);
    setLoading(true);
    setCorrelateResponseData({
      data: [],
      aggregationPeriod: '',
      correlationMetric: '',
    });

    const {
      ticker,
      startYear,
      endYear,
      aggregationPeriod,
      lagPeriods,
      highLevelOnly,
      correlationMetric,
      segment,
    } = inputFields;

    try {
      const urlParams = new URLSearchParams({
        start_year: startYear.toString(),
        aggregation_period: aggregationPeriod,
        lag_periods: lagPeriods.toString(),
        high_level_only: highLevelOnly.toString(),
        correlation_metric: correlationMetric,
        end_year: endYear.toString(),
      });
      if (segment !== undefined && segment !== 'Total Revenue') {
        urlParams.append('segment', segment);
      }
      if (ticker) {
        urlParams.append('stock', ticker);
      }

      if (selected_datasets) {
        selected_datasets.forEach((dataset) => {
          urlParams.append('selected_datasets', dataset);
        });
      }

      const res = await fetch(`api/fetch?${urlParams.toString()}`);
      const jsonData = await handleResponseStatus(res);

      setLoading(false);
      const correlationData: CorrelationData = jsonData.data;
      setCorrelateResponseData(correlationData);
      setHasData(true);
    } catch (e) {
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
    inputFields: z.infer<typeof inputFieldsSchema>,
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
        },
      );

      const jsonData = await handleResponseStatus(res);

      setLoading(false);
      const correlationData: CorrelationData = jsonData.data;
      setCorrelateResponseData(correlationData);
      setHasData(true);
    } catch (e) {
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
