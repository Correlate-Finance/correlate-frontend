'use client';

import { DownloadIcon } from '@radix-ui/react-icons';
import React, { useState } from 'react';
import { CorrelationDataPoint } from './Results';
import DoubleLineChart from './chart/DoubleLineChart';

import { TableCell, TableRow } from '@/components/ui/table';
import { exportToExcel } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';

interface MyComponentProps {
  dp: CorrelationDataPoint;
  lagPeriods: number;
}

const ResultsRow: React.FC<MyComponentProps> = ({ dp, lagPeriods }) => {
  const [expanded, setexpanded] = useState(false);
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

  const handleClickIcon = () => {
    const excelData = dp.dataset_data.map((value, index) => {
      return {
        Date: dp.dates[index],
        Value: value,
      };
    });
    exportToExcel(excelData);
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
          <div title="Export to Excel">
            <DownloadIcon
              className="w-6 h-6 text-white cursor-pointer hover:text-green-400 transition-colors duration-300 ease-in-out"
              onClick={() => handleClickIcon()}
            />
          </div>
        </TableCell>
      </TableRow>
      {expanded && (
        <TableRow
          key={`${dp.title}-${dp.lag}-chart`}
          className="hover:bg-inherit"
        >
          <TableCell colSpan={100}>
            <div className="flex flex-row">
              <DoubleLineChart data={graphData(dp)} />{' '}
              <Button
                onClick={() => router.push(`/data/${dp.title}`)}
                className="text-white bg-blue-700 hover:bg-blue-900"
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
