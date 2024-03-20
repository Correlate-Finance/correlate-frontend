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
