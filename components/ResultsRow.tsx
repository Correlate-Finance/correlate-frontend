'use client';

import { DownloadIcon } from '@radix-ui/react-icons';
import React, {
  MouseEventHandler,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { CorrelationDataPoint } from './Results';
import DoubleLineChart from './chart/DoubleLineChart';

import { getBaseUrl } from '@/app/api/util';
import { Checkbox } from '@/components/ui/checkbox';
import { TableCell, TableRow } from '@/components/ui/table';
import {
  convertToGraphData,
  correlationCoefficient,
  exportToExcel,
} from '@/lib/utils';
import { BellIcon } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { useToast } from './ui/use-toast';

interface MyComponentProps {
  dp: CorrelationDataPoint;
  lagPeriods: number;
  toggleCheckbox: (id: number, checked: boolean) => void;
  index: number;
}

const getIsClicked = async (datasetData: number[], token: string): Promise<any> => {
  return await fetch(`${getBaseUrl()}/users/is_clicked`, {
    method: 'GET',
    body: JSON.stringify({
      dataset: datasetData,
    }),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`,
    },
  }).then((res) => res.json());
};

const addOrRemoveWatchlist = async (
  clicked: boolean,
  datasetData: number[],
  token: string,
): Promise<void> => {
  const postData = {
    method: 'POST',
    body: JSON.stringify({
      dataset: datasetData,
    }),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`,
    },
  };

  await fetch(
    `${getBaseUrl()}/${clicked ? `users/deletewatchlist` : `users/addwatchlist`}`,
    postData,
  ).then((res) => res.json());
};

const ResultsRow: React.FC<MyComponentProps> = ({
  dp,
  lagPeriods,
  index,
  toggleCheckbox,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [correlation, setCorrelation] = useState(dp.pearson_value.toFixed(3));
  const [graphData, setGraphData] = useState(convertToGraphData(dp));
  const router = useRouter();
  const { toast } = useToast();
  const counter = useRef(0);
  const session = useSession();

  const getColorClass = (value: number) => {
    if (Math.abs(value) > 0.8) {
      return 'text-green-600 dark:text-green-400'; // Bright green
    } else if (Math.abs(value) < 0.2) {
      return 'text-red-200'; // Red
    } else {
      return ''; // Default color or any other color you prefer
    }
  };

  useEffect(() => {
    getIsClicked(dp.dataset_data, session.data?.user.accessToken || "").then((data) => setIsClicked(data.is_clicked));
  });

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
              addOrRemoveWatchlist(isClicked, dp.dataset_data, session.data?.user.accessToken || "");
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
              </div>
              <Button
                onClick={() => router.push(`/data/${dp.internal_name}`)}
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
