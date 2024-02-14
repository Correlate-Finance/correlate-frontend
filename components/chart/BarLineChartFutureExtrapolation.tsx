'use client';

import { DataTrendPoint } from '@/app/api/schema';
import { formatNumber, formatPercentage } from '@/lib/utils';
import dayjs from 'dayjs';
import React from 'react';
import {
  Bar,
  Cell,
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

const BarLineChartFutureExtrapolation: React.FC<MyComponentProps> = ({
  data,
  barChartKey,
  lineChartKey,
  barChartKeyFormat,
  lineChartKeyFormat,
  syncId,
  title,
}: MyComponentProps) => {
  // Add 6 future months of data to extrapolate the trend

  if (data.length < 12) {
    return null;
  }
  const dataEndDate = data[0].Date;

  // Add 6 months of future data to the data array
  let futureData: DataTrendPoint[] = [];
  for (let i = 0; i < 6; i++) {
    const dp: DataTrendPoint = {
      Date: dayjs(dataEndDate)
        .add(i + 1, 'month')
        .format('MM-DD-YYYY'),
      Value: 0,
    };
    futureData.unshift(dp);
  }

  futureData = futureData.concat(data);
  futureData = futureData.map((dp, index) => {
    return {
      ...dp,
      [barChartKey]:
        index + 12 < futureData.length
          ? futureData[index + 12][barChartKey]
          : undefined,
    };
  });

  futureData = futureData.slice().reverse();
  const dataLength = futureData.length;
  futureData = futureData.slice(dataLength - 20);
  return (
    <ComposedChart
      width={500}
      height={400}
      data={futureData}
      margin={{
        top: 20,
        right: 20,
        bottom: 20,
        left: 20,
      }}
      {...(syncId && { syncId })}
    >
      <XAxis
        dataKey="Date"
        scale="band"
        angle={-45}
        textAnchor="end"
        interval={0}
        tick={{
          fontSize: 10,
          fill: '#ffffff',
        }}
        height={70}
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
      <text
        x={500 / 2}
        y={10}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
      >
        <tspan fontSize="14">{title}</tspan>
      </text>
      <Tooltip
        formatter={(value, name, { dataKey }) => {
          if (dataKey === lineChartKey && lineChartKeyFormat === 'percentage') {
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
      />
      <Legend />
      <defs>
        <pattern
          id="stripe"
          width="4"
          height="4"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(45)"
        >
          <rect width="3" height="4" fill="#413ea0" />
          <rect x="3" y="0" width="1" height="4" fill="white" />
        </pattern>
      </defs>
      <Bar yAxisId="left" dataKey={barChartKey} barSize={10}>
        {futureData.map((entry) => {
          return (
            <Cell
              key={entry.Date}
              fill={
                dayjs(entry.Date) > dayjs(dataEndDate)
                  ? 'url(#stripe)'
                  : '#413ea0'
              }
            />
          );
        })}
      </Bar>
      <Line
        yAxisId="right"
        type="monotone"
        dataKey={lineChartKey}
        stroke="#ff7300"
      />
    </ComposedChart>
  );
};
export default BarLineChartFutureExtrapolation;
