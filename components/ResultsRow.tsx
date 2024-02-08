'use client';

import React, { useState } from 'react';
import { CorrelationDataPoint } from './Results';
import DoubleLineChart from './DoubleLineChart';

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface MyComponentProps {
  dp: CorrelationDataPoint;
  lagPeriods: number;
}

const ResultsRow: React.FC<MyComponentProps> = ({
  dp,
  lagPeriods,
}) => {
  const [expanded, setexpanded] = useState(false);

  const getColorClass = (value: number) => {
    if (Math.abs(value) > 0.8) {
      return 'text-green-400'; // Bright green
    } else if (Math.abs(value) < 0.2) {
      return 'text-red-200'; // Red
    } else {
      return 'text-white'; // Default color or any other color you prefer
    }
  };

  const graphData = (dp: CorrelationDataPoint) => {
    const combinedList = dp.dates.map((date, index) => {
      return {
        date,
        revenue: dp.input_data[index],
        dataset: dp.dataset_data[index],
      };
    });
    return combinedList;
  };

  const handleClick: React.MouseEventHandler<HTMLDivElement> = (
    e
  ) => {
    console.log('here');
    setexpanded(!expanded);

    e.preventDefault();
  };

  return (
    <>
      <TableRow key={`${dp.title}-${dp.lag}`} onClick={handleClick}>
        <TableCell className="font-medium">{dp.title}</TableCell>
        {lagPeriods > 0 && <TableCell>{dp.lag}</TableCell>}
        <TableCell className={`${getColorClass(dp.pearson_value)}`}>
          {dp.pearson_value}
        </TableCell>
      </TableRow>
      <TableRow
        key={`${dp.title}-${dp.lag}-chart`}
        hidden={!expanded}
        className="hover:bg-inherit"
      >
        <TableCell colSpan={100}>
          {expanded && <DoubleLineChart data={graphData(dp)} />}
        </TableCell>
      </TableRow>
    </>
  );
};

export default ResultsRow;
