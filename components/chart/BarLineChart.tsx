import { DataTrendPoint } from '@/app/api/schema';
import { formatNumber, formatPercentage } from '@/lib/utils';
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
}

const BarLineChart: React.FC<MyComponentProps> = ({
  data,
  barChartKey,
  lineChartKey,
  barChartKeyFormat,
  lineChartKeyFormat,
}: MyComponentProps) => {
  data = data.slice().reverse();
  const dataLength = data.length;
  return (
    <ComposedChart
      width={500}
      height={400}
      data={data}
      margin={{
        top: 20,
        right: 20,
        bottom: 20,
        left: 20,
      }}
    >
      {/* <CartesianGrid stroke="#f5f5f5" /> */}
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
      <Bar yAxisId="left" dataKey={barChartKey} barSize={10} fill="#413ea0" />
      <Line
        yAxisId="right"
        type="monotone"
        dataKey={lineChartKey}
        stroke="#ff7300"
      />
      {dataLength > 20 && (
        <Brush
          dataKey="Date"
          height={30}
          stroke="#8884d8"
          startIndex={dataLength - 20}
          endIndex={dataLength - 1}
          travellerWidth={0}
        />
      )}
    </ComposedChart>
  );
};
export default BarLineChart;
