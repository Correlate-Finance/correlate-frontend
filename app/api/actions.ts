'use server';

import {
  CorrelationData,
  CorrelationDataPoint,
  IndexType,
} from '@/app/api/schema';
import { inputFieldsSchema } from '@/hooks/usePage';
import { authOptions } from '@/lib/configs/authOptions';
import { getServerSession } from 'next-auth/next';
import { z } from 'zod';
import {
  DatasetMetadataType,
  IndexDataset,
  Report,
  registerFieldsSchema,
} from './schema';
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
  index_datasets: string[],
  aggregationPeriod: string,
  correlationMetric: string,
  input_data: number[],
  dates: string[],
): Promise<CorrelationData> {
  const urlParams = new URLSearchParams({
    aggregation_period: aggregationPeriod,
    correlation_metric: correlationMetric,
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
          index_datasets: index_datasets,
          input_data: input_data,
          dates: dates,
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

export async function getAllDatasetMetadata(): Promise<DatasetMetadataType[]> {
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
  data: IndexDataset[],
  indexName: string,
  index_id?: number,
) => {
  const session = await getServerSession(authOptions);

  if (!session) {
    return Promise.reject('Unauthorized');
  }

  let body = {
    index_name: indexName,
    datasets: data,
    ...(index_id && { index_id: index_id }),
  };

  const response = await fetch(`${getBaseUrl()}/save-index/`, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${session.user.accessToken}`,
    },
  });
  const json = await response.json();
  return json;
};

export async function getAllIndices(): Promise<IndexType[]> {
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

export async function getDatasetFilters() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return Promise.reject('Unauthorized');
  }

  const baseUrl = getBaseUrl();
  const response = await fetch(`${baseUrl}/get-dataset-filters`, {
    headers: {
      Authorization: `Token ${session.user.accessToken}`,
    },
  });
  const data = await response.json();
  return data;
}

export async function generateReport(
  topCorrelations: CorrelationDataPoint[],
  correlationParametersId: number,
  stock?: string,
  name?: string,
  companyDescription?: string,
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return Promise.reject('Unauthorized');
  }
  let urlParams;
  if (stock !== undefined) {
    urlParams = new URLSearchParams({
      stock: stock,
      correlation_parameters_id: correlationParametersId.toString(),
    });
  } else if (name !== undefined && companyDescription !== undefined) {
    urlParams = new URLSearchParams({
      correlation_parameters_id: correlationParametersId.toString(),
      name: name,
      company_description: companyDescription,
    });
  } else {
    return Promise.reject('No stock or company information provided');
  }

  const response = await fetch(
    `${getBaseUrl()}/generate-report?${urlParams.toString()}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Token ${session.user.accessToken}`,
      },
      body: JSON.stringify({
        top_correlations: topCorrelations,
      }),
    },
  );
  const data = await response.json();
  return data;
}

export async function getReport(report_id: string): Promise<Report> {
  const session = await getServerSession(authOptions);

  if (!session) {
    return Promise.reject('Unauthorized');
  }

  const urlParams = new URLSearchParams({
    report_id: report_id,
  });

  const response = await fetch(
    `${getBaseUrl()}/get-report?${urlParams.toString()}`,
    {
      headers: {
        Authorization: `Token ${session.user.accessToken}`,
      },
    },
  );
  const data = await response.json();
  return data;
}

export async function getAllReports(): Promise<Report[]> {
  const session = await getServerSession(authOptions);

  if (!session) {
    return Promise.reject('Unauthorized');
  }

  const response = await fetch(`${getBaseUrl()}/get-all-reports`, {
    headers: {
      Authorization: `Token ${session.user.accessToken}`,
    },
  });

  const data = await response.json();
  return data;
}

export async function generateAutomaticReport(
  stocks: string[],
): Promise<Report> {
  const session = await getServerSession(authOptions);

  if (!session) {
    return Promise.reject('Unauthorized');
  }

  const urlParams = new URLSearchParams({});
  stocks.forEach((stock) => {
    urlParams.append('stocks', stock);
  });

  const response = await fetch(
    `${getBaseUrl()}/generate-automatic-report/?${urlParams.toString()}`,
    {
      headers: {
        Authorization: `Token ${session.user.accessToken}`,
      },
      method: 'POST',
    },
  );

  const data = await response.json();
  return data;
}
