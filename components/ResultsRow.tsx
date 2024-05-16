'use client';

import { CorrelationDataPoint } from '@/app/api/schema';
import { DownloadIcon } from '@radix-ui/react-icons';
import React, {
  MouseEventHandler,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import DoubleLineChart from './chart/DoubleLineChart';

import { addOrRemoveWatchlist } from '@/app/api/actions';
import { Checkbox } from '@/components/ui/checkbox';
import { TableCell, TableRow } from '@/components/ui/table';
import {
  convertToGraphData,
  correlationCoefficient,
  exportToExcel,
} from '@/lib/utils';
import { BellIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { useToast } from './ui/use-toast';

interface MyComponentProps {
  dp: CorrelationDataPoint;
  lagPeriods: number;
  toggleCheckbox: (id: number, checked: boolean) => void;
  index: number;
  addedToWatchlist: boolean;
}

const ResultsRow: React.FC<MyComponentProps> = ({
  dp,
  lagPeriods,
  index,
  toggleCheckbox,
  addedToWatchlist,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [correlation, setCorrelation] = useState(dp.pearson_value.toFixed(3));
  const [graphData, setGraphData] = useState(convertToGraphData(dp));
  const router = useRouter();
  const { toast } = useToast();
  const counter = useRef(0);

  useEffect(() => {
    setIsClicked(addedToWatchlist);
  }, [addedToWatchlist]);

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
    exportToExcel(excelData, dp.title, dp.source, dp.description);
  };

  useEffect(() => {
    setGraphData(convertToGraphData(dp));
  }, [dp]);

  const onBrushChange = useCallback(
    ({ startIndex, endIndex }: { startIndex?: number; endIndex?: number }) => {
      const X = dp.dataset_data.slice(
        startIndex,
        endIndex ? endIndex - dp.lag + 1 : dp.dataset_data.length - dp.lag,
      );
      const Y = dp.input_data.slice(
        startIndex ? startIndex + dp.lag : dp.lag,
        endIndex ? endIndex + 1 : dp.input_data.length,
      );
      setCorrelation(correlationCoefficient(X, Y).toFixed(3));
      counter.current++;
    },
    [dp],
  );

  return (
    <>
      <TableRow key={`${dp.title}-${dp.lag}`} onClick={handleClick}>
        <TableCell>
          <Checkbox
            onCheckedChange={(e) => {
              if (e !== 'indeterminate') {
                toggleCheckbox(index, e);
              }
            }}
            onClick={(e) => e.stopPropagation()}
          />
        </TableCell>
        <TableCell className="font-medium w-3/4">{dp.title}</TableCell>
        {lagPeriods > 0 && <TableCell>{dp.lag}</TableCell>}
        <TableCell className={`${getColorClass(dp.pearson_value)} text-center`}>
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
              addOrRemoveWatchlist(isClicked, dp.title);
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
              <div className="w-full">
                <DoubleLineChart
                  data={graphData}
                  syncId="sync"
                  onBrushChange={onBrushChange}
                  correlation={correlation}
                />
                <p className="dark:text-gray-300 text-gray-400 pl-16">
                  {dp.source}: {dp.url}
                </p>
              </div>
              <Link href={`/data/${dp.internal_name}`}>
                <Button
                  onClick={() => router.push(`/data/${dp.internal_name}`)}
                  className="bg-blue-700 hover:bg-blue-900"
                >
                  Data Trend
                </Button>
              </Link>
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  );
};

export default ResultsRow;
