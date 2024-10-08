import { getCompanySegments } from '@/app/api/actions';
import { CorrelationData } from '@/app/api/schema';
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

export function useCorrelateInputData() {
  const [correlateInputData, setCorrelateInputData] = useLocalStorage<
    string[][]
  >('correlateInputData', []);
  return { correlateInputData, setCorrelateInputData };
}

export function useCorrelateResponseData(
  localStorageKey: string = 'correlateResponseData',
) {
  const [correlateResponseData, setCorrelateResponseData] =
    useLocalStorage<CorrelationData>('correlateResponseData', {
      data: [],
      aggregationPeriod: '',
      correlationMetric: '',
      correlationParametersId: -1,
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
  setCorrelateInputData?: (inputData: string[][]) => void,
) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [hasData, setHasData] = useLocalStorage<boolean>('hasData', false);
  const { fetchRevenueData, revenueData } = useFetchRevenueData();

  const onSubmit = async ({
    inputFields,
    selectedDatasets,
    selectedIndexes,
  }: {
    inputFields: z.infer<typeof inputFieldsSchema>;
    selectedDatasets?: Array<string>;
    selectedIndexes?: Array<number>;
  }) => {
    fetchRevenueData(inputFields);
    if (setCorrelateInputData) {
      setCorrelateInputData(revenueData);
    }
    setLoading(true);
    setCorrelateResponseData({
      data: [],
      aggregationPeriod: '',
      correlationMetric: '',
      correlationParametersId: -1,
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

      if (selectedDatasets) {
        selectedDatasets.forEach((dataset) => {
          urlParams.append('selected_datasets', dataset);
        });
      }
      if (selectedIndexes) {
        selectedIndexes.forEach((index) => {
          urlParams.append('selected_indexes', index.toString());
        });
      }

      const res = await fetch(`api/fetch?${urlParams.toString()}`);
      const jsonData = await handleResponseStatus(res);

      setLoading(false);
      const correlationData: CorrelationData = {
        data: jsonData.data.data,
        aggregationPeriod: jsonData.data.aggregation_period,
        correlationMetric: jsonData.data.correlation_metric,
        correlationParametersId: jsonData.data.correlation_parameters_id,
      };
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
  setCorrelateInputData?: (inputData: string[][]) => void,
) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [hasData, setHasData] = useLocalStorage<boolean>('hasData', false);

  const correlateInputText = async ({
    inputFields,
    selectedDatasets,
    selectedIndexes,
  }: {
    inputFields: z.infer<typeof inputFieldsSchema>;
    selectedDatasets?: Array<string>;
    selectedIndexes?: Array<number>;
  }) => {
    if (!inputFields.inputData) {
      alert('No input data');
      return;
    }

    function generateTabularData() {
      let rows = inputFields.inputData?.split('\n');
      let table: string[][] = [];

      rows?.forEach((row) => {
        table.push(row.split('\t'));
      });
      // Transpose table if needed
      if (table.length == 2) {
        table = table[0].map((_, colIndex) =>
          table.map((row) => row[colIndex]),
        );
      }
      return table;
    }

    setLoading(true);
    if (setCorrelateInputData) {
      setCorrelateInputData(generateTabularData());
    }
    try {
      const urlParams = new URLSearchParams({
        fiscal_year_end: inputFields.fiscalYearEnd,
        aggregation_period: inputFields.aggregationPeriod,
        lag_periods: inputFields.lagPeriods.toString(),
        high_level_only: inputFields.highLevelOnly.toString(),
        correlation_metric: inputFields.correlationMetric,
      });

      if (selectedDatasets) {
        selectedDatasets.forEach((dataset) => {
          urlParams.append('selected_datasets', dataset);
        });
      }
      if (selectedIndexes) {
        selectedIndexes.forEach((index) => {
          urlParams.append('selected_indexes', index.toString());
        });
      }

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
      const correlationData: CorrelationData = {
        data: jsonData.data.data,
        aggregationPeriod: jsonData.data.aggregation_period,
        correlationMetric: jsonData.data.correlation_metric,
        correlationParametersId: jsonData.data.correlation_parameters_id,
      };
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
