'use client';

import { formatNumber } from '@/lib/utils';
import React from 'react';
import {
  Brush,
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
  syncId?: string;
  onBrushChange?: (e: any) => void;
  correlation?: string;
}

const renderCircleTraveller = (props: any) => {
  const { x, y, width, height } = props;

  return (
    <circle
      cx={x + width / 2 + 1}
      cy={y + height / 2}
      r={height * 2}
      fill="#8884d8"
    />
  );
};

const DoubleLineChart: React.FC<MyComponentProps> = ({
  data,
  syncId,
  onBrushChange,
  correlation,
}) => {
  return (
    <>
      {correlation && (
        <p className="text-center">
          Correlation: <strong>{correlation}</strong>
        </p>
      )}
      <ResponsiveContainer aspect={5 / 3} {...(syncId && { syncId })}>
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
          <Brush
            dataKey="date"
            height={4}
            stroke="#8884d8"
            // fill="#8884d8"
            travellerWidth={5}
            traveller={renderCircleTraveller}
            {...(onBrushChange && {
              onChange: (e) => {
                onBrushChange(e);
              },
            })}
          />
        </LineChart>
      </ResponsiveContainer>
    </>
  );
};

export default React.memo(DoubleLineChart);
