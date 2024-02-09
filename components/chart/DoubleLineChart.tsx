'use client';

import { DataFormatter } from '@/lib/utils';
import React from 'react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import CustomTooltip from '../CustomTooltip';

export type GraphDataPoint = {
  date: string;
  revenue: number | null;
  dataset: number | null;
};

interface MyComponentProps {
  data: GraphDataPoint[];
}

const DoubleLineChart: React.FC<MyComponentProps> = ({ data }) => {
  return (
    <LineChart
      width={500}
      height={300}
      data={data}
      margin={{
        top: 5,
        right: 30,
        left: 20,
        bottom: 5,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="date" />
      <YAxis yAxisId="left" tickFormatter={DataFormatter} />
      <YAxis
        yAxisId="right"
        orientation="right"
        tickFormatter={DataFormatter}
      />
      <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
      <Legend />
      <Line
        yAxisId="left"
        type="monotone"
        dataKey="revenue"
        stroke="#AA4A44"
        dot={{
          r: 1,
          fill: '#AA4A44',
        }}
      />
      <Line
        yAxisId="right"
        type="monotone"
        dataKey="dataset"
        stroke="#82ca9d"
        dot={{ r: 1, fill: '#82ca9d' }}
      />
    </LineChart>
  );
};

export default DoubleLineChart;
