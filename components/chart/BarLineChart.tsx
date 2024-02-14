'use client';

import { DataTrendPoint } from '@/app/api/schema';
import { formatNumber, formatPercentage } from '@/lib/utils';
import dayjs from 'dayjs';
import React from 'react';
import {
  Bar,
  Brush,
  ComposedChart,
  Legend,
  Line,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface MyComponentProps {
  data: DataTrendPoint[];
  barChartKey: string;
  lineChartKey: string;
  barChartKeyFormat: 'number' | 'percentage';
  lineChartKeyFormat: 'number' | 'percentage';
  syncId?: string;
  title: string;
}

const BarLineChart: React.FC<MyComponentProps> = ({
  data,
  barChartKey,
  lineChartKey,
  barChartKeyFormat,
  lineChartKeyFormat,
  syncId,
  title,
}: MyComponentProps) => {
  data = data.slice().reverse();
  const dataLength = data.length;
  return (
    <ComposedChart
      width={450}
      height={400}
      data={data}
      {...(syncId && { syncId })}
    >
      <text
        x={450 / 2}
        y={10}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
      >
        <tspan fontSize="14">{title}</tspan>
      </text>
      {dataLength > 0 && (
        <>
          <XAxis
            dataKey="Date"
            angle={-45}
            textAnchor="end"
            tick={{
              fontSize: 10,
              fill: '#ffffff',
            }}
            minTickGap={0}
            tickFormatter={(date) => dayjs(date).format('MMM YYYY')}
          />
          <YAxis
            yAxisId="left"
            tickFormatter={(number) => {
              if (barChartKeyFormat === 'percentage') {
                return formatPercentage(number);
              } else {
                return formatNumber(number);
              }
            }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            tickFormatter={(number) => {
              if (lineChartKeyFormat === 'percentage') {
                return formatPercentage(number);
              } else {
                return formatNumber(number);
              }
            }}
          />
          <Legend />
          <Bar
            yAxisId="left"
            dataKey={barChartKey}
            barSize={10}
            fill="#413ea0"
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey={lineChartKey}
            stroke="#ff7300"
          />
          <Brush
            dataKey="Date"
            height={30}
            stroke="#8884d8"
            startIndex={dataLength - 20}
            travellerWidth={0}
            data={data}
            className="hidden"
          />
          <Tooltip
            formatter={(value, name, { dataKey }) => {
              if (
                dataKey === lineChartKey &&
                lineChartKeyFormat === 'percentage'
              ) {
                return formatPercentage(value as number);
              } else if (
                dataKey === barChartKey &&
                barChartKeyFormat === 'percentage'
              ) {
                return formatPercentage(value as number);
              } else {
                return formatNumber(value as number);
              }
            }}
            labelFormatter={(label) => dayjs(label).format('MMM YYYY')}
          />
        </>
      )}
    </ComposedChart>
  );
};
export default BarLineChart;
