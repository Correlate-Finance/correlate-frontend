'use client';

import { formatNumber } from '@/lib/utils';
import React from 'react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
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
    <ResponsiveContainer aspect={5 / 3}>
      <LineChart
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
        <YAxis yAxisId="left" tickFormatter={formatNumber} />
        <YAxis
          yAxisId="right"
          orientation="right"
          tickFormatter={formatNumber}
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
    </ResponsiveContainer>
  );
};

export default DoubleLineChart;
