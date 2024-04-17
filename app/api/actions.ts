'use server';

import { registerFieldsSchema } from '@/app/register/page';
import { CorrelationData } from '@/components/Results';
import { inputFieldsSchema } from '@/hooks/usePage';
import { authOptions } from '@/lib/configs/authOptions';
import { getServerSession } from 'next-auth/next';
import { z } from 'zod';
import { DatasetMetadata } from './schema';
import { getBaseUrl } from './util';

export async function registerUser(
  values: z.infer<typeof registerFieldsSchema>,
) {
  const response = await fetch(`${getBaseUrl()}/users/register`, {
    method: 'POST',
    body: JSON.stringify({
      email: values.email,
      name: values.name,
      password: values.password,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const data = await response.json();
  return data;
}

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

export async function getAllDatasetMetadata(): Promise<DatasetMetadata[]> {
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

  const response = await fetch(`${getBaseUrl()}/users/watchlisted`, {
    method: 'POST',
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

export async function getCompanySegments(
  values: z.infer<typeof inputFieldsSchema>,
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return Response.json({ error: 'Unauthorized', status: 401 });
  }

  if (values.ticker === undefined) {
    return Response.json({ error: 'No stock provided', status: 400 });
  }

  const urlParams = new URLSearchParams({
    aggregation_period: values.aggregationPeriod,
    stock: values.ticker,
    start_year: values.startYear.toString(),
  });

  if (values.endYear) {
    urlParams.append('end_year', values.endYear.toString());
  }

  try {
    const res = await fetch(
      `${getBaseUrl()}/segment_data?${urlParams.toString()}`,
      {
        headers: {
          Authorization: `Token ${session.user.accessToken}`,
        },
      },
    );

    if (!res.ok) {
      return Promise.reject('Unable to fetch data from the server');
    }

    const data = await res.json();
    // Extract only the top level segment names
    return data;
  } catch (error) {
    return Promise.reject(error);
  }
}

export const sendOTP = async (email: string) => {
  const response = await fetch(`${getBaseUrl()}/users/send-otp`, {
    method: 'POST',
    body: JSON.stringify({
      email: email,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const data = await response.json();
  return data;
};

export const verifyOTP = async (email: string, otp: string) => {
  const response = await fetch(`${getBaseUrl()}/users/verify-otp`, {
    method: 'POST',
    body: JSON.stringify({
      email: email,
      otp: otp,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const data = await response.json();
  return data;
};

export const changePassword = async (email: string, password: string) => {
  const response = await fetch(`${getBaseUrl()}/users/change-password`, {
    method: 'POST',
    body: JSON.stringify({
      email: email,
      password: password,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const data = await response.json();
  return data;
};

export const saveIndex = async (
  data: CorrelationData,
  indexName: string,
  percentages: number[],
) => {
  const session = await getServerSession(authOptions);

  if (!session) {
    return Promise.reject('Unauthorized');
  }

  const response = await fetch(`${getBaseUrl()}/save-index/`, {
    method: 'POST',
    body: JSON.stringify({
      index_name: indexName,
      datasets: data.data.map((d, i) => ({
        title: d.title,
        percentage: percentages[i],
      })),
      aggregation_period: data.aggregationPeriod,
      correlation_metric: data.correlationMetric,
    }),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${session.user.accessToken}`,
    },
  });
  const json = await response.json();
  return json;
};

export async function getAllIndices() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return Promise.reject('Unauthorized');
  }

  const baseUrl = getBaseUrl();
  const response = await fetch(`${baseUrl}/get-indices`, {
    headers: {
      Authorization: `Token ${session.user.accessToken}`,
    },
  });
  const data = await response.json();
  return data;
}
