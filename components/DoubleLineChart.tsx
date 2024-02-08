'use client';

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Legend,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import CustomTooltip from './CustomTooltip';

export type GraphDataPoint = {
  date: string;
  revenue: number;
  dataset: number;
};

interface MyComponentProps {
  data: GraphDataPoint[];
}

const DoubleLineChart: React.FC<MyComponentProps> = ({ data }) => {
  const DataFormatter = new Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short',
  }).format;

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
      <Tooltip
        content={<CustomTooltip />}
        cursor={{ fill: 'transparent' }}
      />
      <Legend />
      <Line
        yAxisId="left"
        type="monotone"
        dataKey="revenue"
        stroke="#AA4A44"
        activeDot={{ r: 8 }}
      />
      <Line
        yAxisId="right"
        type="monotone"
        dataKey="dataset"
        stroke="#82ca9d"
      />
    </LineChart>
  );
};

export default DoubleLineChart;
