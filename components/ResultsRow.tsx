'use client';

import { DownloadIcon } from '@radix-ui/react-icons';
import React, { MouseEventHandler, useState } from 'react';
import { CorrelationDataPoint } from './Results';
import DoubleLineChart from './chart/DoubleLineChart';

import { Checkbox } from '@/components/ui/checkbox';
import { TableCell, TableRow } from '@/components/ui/table';
import { convertToGraphData, exportToExcel } from '@/lib/utils';
import { BellIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { useToast } from './ui/use-toast';

interface MyComponentProps {
  dp: CorrelationDataPoint;
  lagPeriods: number;
  toggleCheckbox: (id: number, checked: boolean) => void;
  index: number;
  uncheckedDisabled: boolean;
}

const ResultsRow: React.FC<MyComponentProps> = ({
  dp,
  lagPeriods,
  index,
  toggleCheckbox,
  uncheckedDisabled,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const getColorClass = (value: number) => {
    if (Math.abs(value) > 0.8) {
      return 'text-green-600 dark:text-green-400'; // Bright green
    } else if (Math.abs(value) < 0.2) {
      return 'text-red-200'; // Red
    } else {
      return ''; // Default color or any other color you prefer
    }
  };

  const handleClick: MouseEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    setExpanded(!expanded);
  };

  const handleClickIcon = () => {
    const excelData = dp.dataset_data.map((value, index) => {
      return {
        Date: dp.dates[index],
        Value: value,
      };
    });
    exportToExcel(excelData, dp.title);
  };

  return (
    <>
      <TableRow key={`${dp.title}-${dp.lag}`} onClick={handleClick}>
        <TableCell>
          <Checkbox
            onCheckedChange={(e) => {
              if (e !== 'indeterminate') {
                toggleCheckbox(index, e);
                setIsChecked(e);
              }
            }}
            onClick={(e) => e.stopPropagation()}
            className={`${uncheckedDisabled && !isChecked ? 'opacity-50 pointer-events-none' : ''}`}
          />
        </TableCell>
        <TableCell className="font-medium w-3/4">{dp.title}</TableCell>
        {lagPeriods > 0 && <TableCell>{dp.lag}</TableCell>}
        <TableCell className={`${getColorClass(dp.pearson_value)}`}>
          {dp.pearson_value.toFixed(3)}
        </TableCell>
        <TableCell onClick={(e) => e.stopPropagation()}>
          <div title="Export to Excel">
            <DownloadIcon
              className="w-6 h-6 cursor-pointer hover:text-green-400 transition-colors duration-300 ease-in-out"
              onClick={() => handleClickIcon()}
            />
          </div>
        </TableCell>
        <TableCell>
          <BellIcon
            className={`w-6 h-6 cursor-pointer }`}
            fill={isClicked ? '#166534' : 'currentColor'}
            stroke={isClicked ? '#166534' : 'currentColor'}
            onClick={(e) => {
              if (!isClicked) {
                toast({
                  title: 'Enabled Alerts for',
                  description: `${dp.title}`,
                });
              } else {
                toast({
                  title: 'Disabled Alerts for',
                  description: `${dp.title}`,
                });
              }
              setIsClicked(!isClicked);
              e.stopPropagation();
            }}
          />
        </TableCell>
      </TableRow>
      {expanded && (
        <TableRow
          key={`${dp.title}-${dp.lag}-chart`}
          className="hover:bg-inherit"
        >
          <TableCell colSpan={100}>
            <div className="flex flex-row items-end">
              <div className="w-[500px]">
                <DoubleLineChart data={convertToGraphData(dp)} />{' '}
              </div>
              <Button
                onClick={() => router.push(`/data/${dp.title}`)}
                className="bg-blue-700 hover:bg-blue-900"
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
