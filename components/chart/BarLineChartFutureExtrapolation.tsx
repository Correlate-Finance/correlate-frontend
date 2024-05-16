'use client';

import { DataTrendPoint } from '@/app/api/schema';
import { formatNumber, formatPercentage } from '@/lib/utils';
import dayjs from 'dayjs';
import { useTheme } from 'next-themes';
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
  const dataLength = data.length;
  let futureData: DataTrendPoint[] = [];
  let dataEndDate: string | undefined = undefined;
  const { resolvedTheme } = useTheme();
  if (dataLength > 0) {
    dataEndDate = data[0].Date;

    // Add 6 months of future data to the data array
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

    // Reverse and slice data to show only the last 20 months
    futureData = futureData.slice().reverse();
    futureData = futureData.slice(dataLength - 20);
  }
  return (
    <ComposedChart
      width={450}
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
      <text
        x={450 / 2}
        y={10}
        fill={resolvedTheme === 'dark' ? 'white' : 'black'}
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
              fill: resolvedTheme === 'dark' ? 'white' : 'black',
            }}
            height={50}
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
            {dataEndDate &&
              futureData.map((entry) => {
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
            yAxisId="left"
            type="monotone"
            dataKey={lineChartKey}
            stroke="#ff7300"
          />
        </>
      )}
    </ComposedChart>
  );
};
export default BarLineChartFutureExtrapolation;
