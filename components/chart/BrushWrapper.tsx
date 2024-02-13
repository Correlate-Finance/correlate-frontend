import { DataTrendPoint } from '@/app/api/schema';
import React, { useState } from 'react';
import { Brush, ComposedChart, Line } from 'recharts';

interface MyComponentProps {
  data: DataTrendPoint[];
  syncId?: string;
}

const BrushWrapper: React.FC<MyComponentProps> = ({
  data,
  syncId,
}: MyComponentProps) => {
  const [hidden, setHidden] = useState(false);
  data = data.slice().reverse();
  const dataLength = data.length;
  return (
    <div className="grid">
      {!hidden && (
        <p
          className="text-opacity-80 col-start-1 row-start-1 text-center z-10"
          onMouseEnter={() => setHidden(true)}
        >
          Slide to change dates
        </p>
      )}
      <ComposedChart
        width={1000}
        height={50}
        data={data}
        margin={{
          top: 0,
          right: 100,
          bottom: 20,
          left: 100,
        }}
        {...(syncId && { syncId })}
        className="col-start-1 row-start-1"
      >
        <Line
          type="monotone"
          dataKey="Value"
          stroke="#ff7300"
          className="hidden"
        />

        <Brush
          dataKey="Date"
          height={30}
          stroke="#8884d8"
          startIndex={dataLength - 20}
          travellerWidth={5}
        />
      </ComposedChart>
    </div>
  );
};

export default BrushWrapper;
