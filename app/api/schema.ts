import { z } from 'zod';

export interface DataTrendPoint {
  Date: string;
  Value: number;
  T3M?: number;
  T6M?: number;
  T12M?: number;
  YoYGrowth?: number;
  T3M_YoYGrowth?: number;
  T6M_YoYGrowth?: number;
  T12M_YoYGrowth?: number;
  Stack2Y?: number;
  Stack3Y?: number;
  Stack4Y?: number;
  Stack5Y?: number;

  // Seasonality fields
  MoMGrowth?: number;
  averageMoM?: number;
  DeltaSeasonality?: number;
  [index: string]: string | number | undefined;
}

export interface DatasetMetadataType {
  internal_name: string;
  external_name: string;
  description: string;
  source: string;
  url: string;
  release: string;
  popularity: number;
  categories: string[];
  units: string;
}

export interface IndexDataset {
  title: string;
  percentage: string;
}

export interface DatasetFilters {
  categories: string[];
  source: string[];
  release: string[];
}

export type CorrelationData = {
  data: CorrelationDataPoint[];
  aggregationPeriod: string;
  correlationMetric: string;
};

export type CorrelationDataPoint = {
  title: string;
  internal_name: string;
  pearson_value: number;
  p_value: number;
  lag: number;
  input_data: number[];
  dataset_data: number[];
  dates: string[];
  source?: string;
  description?: string;
  release?: string;
  url?: string;
  units?: string;
  categories?: string[];
};

export type IndexDatasetType = {
  dataset: DatasetMetadataType;
  weight: number;
};

export type IndexType = {
  id: number;
  name: string;
  index_datasets: IndexDatasetType[];
};

export const registerFieldsSchema = z
  .object({
    email: z.string().min(1).max(255),
    name: z.string().min(1).max(255),
    password: z.string().min(1).max(255),
    confirmPassword: z.string().min(1).max(255),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: 'custom',
        message: 'The passwords did not match',
        path: ['confirmPassword'],
      });
    }
  });
