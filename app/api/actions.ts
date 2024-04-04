'use server';
import { CorrelationData } from '@/components/Results';
import { authOptions } from '@/lib/configs/authOptions';
import { getServerSession } from 'next-auth/next';
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
  const session = await getServerSession(authOptions);

  if (!session) {
    return Promise.reject('Unauthorized');
  }

  try {
    const response = await fetch(
      `${getBaseUrl()}/correlate-index/?${urlParams.toString()}`,
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
          Authorization: `Token ${session.user.accessToken}`,
        },
      },
    );
    const json = await response.json();
    return json;
  } catch (error) {
    return Promise.reject(error);
  }
}

export async function getAllDatasetMetadata() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return Promise.reject('Unauthorized');
  }

  const baseUrl = getBaseUrl(); // Replace with your base URL
  const response = await fetch(`${baseUrl}/get-all-dataset-metadata`, {
    headers: {
      Authorization: `Token ${session.user.accessToken}`,
    },
  });
  const data = await response.json();
  return data;
}

export const fetchWatchlistedRows = async (datasetTitles: string[]) => {
  const session = await getServerSession(authOptions);

  if (!session) {
    return Promise.reject('Unauthorized');
  }

  const response = await fetch(`${getBaseUrl()}/users/is_clicked`, {
    method: 'GET',
    body: JSON.stringify({
      datasets: datasetTitles,
    }),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${session?.user.accessToken}`,
    },
  });
  const data = await response.json();
  return data;
};

export const addOrRemoveWatchlist = async (
  clicked: boolean,
  datasetTitle: string,
) => {
  const session = await getServerSession(authOptions);

  if (!session) {
    return Promise.reject('Unauthorized');
  }

  const postData = {
    method: 'POST',
    body: JSON.stringify({
      dataset: datasetTitle,
    }),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${session?.user.accessToken}`,
    },
  };

  const response = await fetch(
    `${getBaseUrl()}/${clicked ? `users/deletewatchlist` : `users/addwatchlist`}`,
    postData,
  );
  const data = await response.json();
  return data;
};
