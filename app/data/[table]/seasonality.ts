// Helper methods to be able to calculate seasonality for a given table

import { DataTrendPoint } from '@/app/api/schema';
import dayjs from 'dayjs';

export type MonthlySeasonality = {
  month: string;
  value: number;
};

export const calculateSeasonality = (
  data: DataTrendPoint[],
  selectedYears: string[],
) => {
  const filteredDataSeasonal = data.filter((dp) => {
    return selectedYears.includes(dayjs(dp.Date).format('YYYY'));
  });

  const seasonalData = filteredDataSeasonal.reduce(
    (acc, dp) => {
      const month = dayjs(dp.Date).format('MMMM');
      if (acc[month]) {
        acc[month].push(dp.MoMGrowth);
      } else {
        acc[month] = [dp.MoMGrowth];
      }
      return acc;
    },
    {} as { [key: string]: number[] },
  );

  const seasonalDataAverage = Object.keys(seasonalData).reduce(
    (acc, month) => {
      acc[month] =
        seasonalData[month].reduce((acc, value) => acc + value, 0) /
        seasonalData[month].length;
      return acc;
    },
    {} as { [key: string]: number },
  );

  const seasonalDataAverageSorted = Object.keys(seasonalDataAverage).sort(
    (a, b) => {
      return dayjs(a, 'MMMM').month() - dayjs(b, 'MMMM').month();
    },
  );

  return seasonalDataAverageSorted.map((month) => {
    return {
      month,
      value: seasonalDataAverage[month],
    };
  });
};
