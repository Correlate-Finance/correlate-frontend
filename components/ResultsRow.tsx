'use client';

import React, { useState } from 'react';
import { CorrelationDataPoint } from './Results';
import DoubleLineChart from './chart/DoubleLineChart';
import Clipboard from './clipboard/Clipboard';

import { TableCell, TableRow } from '@/components/ui/table';
import { convertToExcel } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';

interface MyComponentProps {
  dp: CorrelationDataPoint;
  lagPeriods: number;
}

const ResultsRow: React.FC<MyComponentProps> = ({ dp, lagPeriods }) => {
  const [expanded, setexpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const router = useRouter();

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
    const total = dp.dates.length;
    const combinedList = dp.dates.map((date, index) => {
      return {
        date,
        // For revenue we want to remove items from the bottom of the list.
        revenue: index < dp.lag ? null : dp.input_data[index],
        // for dataset we want to remove items from the top.
        dataset: index >= total - dp.lag ? null : dp.dataset_data[index],
      };
    });
    return combinedList;
  };

  const handleClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    setexpanded(!expanded);
  };

  return (
    <>
      <TableRow key={`${dp.title}-${dp.lag}`} onClick={handleClick}>
        <TableCell className="font-medium">{dp.title}</TableCell>
        {lagPeriods > 0 && <TableCell>{dp.lag}</TableCell>}
        <TableCell className={`${getColorClass(dp.pearson_value)}`}>
          {dp.pearson_value}
        </TableCell>
        <TableCell onClick={(e) => e.stopPropagation()}>
          <Clipboard
            copied={copied}
            setCopied={setCopied}
            text={convertToExcel(dp.dataset_data, dp.dates)}
            color="white"
          />
        </TableCell>
      </TableRow>
      {expanded && (
        <TableRow
          key={`${dp.title}-${dp.lag}-chart`}
          className="hover:bg-inherit"
        >
          <TableCell colSpan={100}>
            <div className="flex flex-row justify-between items-end">
              <DoubleLineChart data={graphData(dp)} />{' '}
              <Button
                onClick={() => router.push(`/data/${dp.title}`)}
                className="text-white"
              >
                See More
              </Button>
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  );
};

export default ResultsRow;
