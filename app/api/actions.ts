'use server';
import { CorrelationData } from '@/components/Results';
import { getBaseUrl } from './util';

export async function correlateIndex(
  values: { indexName?: string; percentages: string[] },
  data: CorrelationData,
  checkedRows: Set<number>,
): Promise<CorrelationData> {
  const urlParams = new URLSearchParams({
    aggregation_period: data.aggregationPeriod,
    correlation_metric: data.correlationMetric,
  });

  try {
    const response = await fetch(
      `${getBaseUrl()}/correlateindex/?${urlParams.toString()}`,
      {
        method: 'POST',
        body: JSON.stringify({
          index_name: values.indexName,
          index_percentages: values.percentages,
          index_datasets: Array.from(checkedRows).map(
            (i) => data.data[i].title,
          ),
          input_data: data.data[0].input_data,
          dates: data.data[0].dates,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      },
    );
    const json = await response.json();
    return json;
  } catch (error) {
    return Promise.reject(error);
  }
}
