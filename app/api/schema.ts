import { z } from 'zod';

const DataPointSchema = z.object({
  date: z
    .string({
      required_error: 'Date is required',
    })
    .trim()
    .min(1, 'Date cannot be empty'),
  value: z
    .number({
      required_error: 'Value is required',
    })
});

export const RevenueResponseSchema = z.array(DataPointSchema)

export type DataPoint = z.infer<typeof DataPointSchema>;
