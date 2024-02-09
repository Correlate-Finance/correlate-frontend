import { z } from 'zod';

const DataPointSchema = z.object({
  date: z
    .string({
      required_error: 'Date is required',
    })
    .trim()
    .min(1, 'Date cannot be empty'),
  value: z.string({
    required_error: 'Value is required',
  }),
});

export const RevenueResponseSchema = z.array(DataPointSchema);

export type DataPoint = z.infer<typeof DataPointSchema>;

export type DataTrendPoint = {
  Date: string;
  Value: number;
  T3M: number;
  T6M: number;
  T12M: number;
  YoYGrowth: number;
  T3M_YoYGrowth: number;
  T6M_YoYGrowth: number;
  T12M_YoYGrowth: number;
  Stack2Y: number;
  Stack3Y: number;
};
