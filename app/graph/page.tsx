import DoubleLineChart from '@/components/DoubleLineChart';
import React from 'react';

const Page = () => {
  const data = [
    {
      date: 'Page A',
      revenue: 1200,
      dataset: 10000,
    },
    {
      date: 'Page B',
      revenue: 8000,
      dataset: 20000,
    },
    {
      date: 'Page C',
      revenue: 9000,
      dataset: 30000,
    },
    {
      date: 'Page D',
      revenue: 10000,
      dataset: 40000,
    },
    {
      date: 'Page E',
      revenue: 15000,
      dataset: 50000,
    },
  ];
  return <DoubleLineChart data={data} />;
};

export default Page;
