// Helper methods to be able to calculate seasonality for a given table

import { DataTrendPoint } from '@/app/api/schema';
import dayjs from 'dayjs';

export type MonthlySeasonality = {
  month: string;
  value: number;
};

const monthOrder: { [key: string]: number } = {
  January: 0,
  February: 1,
  March: 2,
  April: 3,
  May: 4,
  June: 5,
  July: 6,
  August: 7,
  September: 8,
  October: 9,
  November: 10,
  December: 11,
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
        acc[month].push(dp.MoMGrowth ? dp.MoMGrowth : 0);
      } else {
        acc[month] = [dp.MoMGrowth ? dp.MoMGrowth : 0];
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
      return monthOrder[b] - monthOrder[a];
    },
  );

  return seasonalDataAverageSorted.map((month) => {
    return {
      month,
      value: seasonalDataAverage[month],
    };
  });
};
