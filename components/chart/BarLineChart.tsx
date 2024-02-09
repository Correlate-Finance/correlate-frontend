import { DataTrendPoint } from '@/app/api/schema';
import React from 'react';
import {
  Bar,
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
}

const BarLineChart: React.FC<MyComponentProps> = ({
  data,
  barChartKey,
  lineChartKey,
}: MyComponentProps) => {
  data = data.toReversed();
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
      <XAxis dataKey="Date" scale="band" />
      <YAxis yAxisId="left" />
      <YAxis yAxisId="right" orientation="right" />
      <Tooltip />
      <Legend />
      <Bar yAxisId="left" dataKey={barChartKey} barSize={10} fill="#413ea0" />
      <Line
        yAxisId="right"
        type="monotone"
        dataKey={lineChartKey}
        stroke="#ff7300"
      />
    </ComposedChart>
  );
};
export default BarLineChart;
