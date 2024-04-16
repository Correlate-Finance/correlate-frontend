import {
  Table,
  TableBody,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { exportMultipleToExcel } from '@/lib/utils';
import React, { useEffect, useState } from 'react';
import IndexModal from './IndexModal';
import ResultsRow from './ResultsRow';
import { Button } from './ui/button';

interface MyComponentProps {
  data: CorrelationData;
  lagPeriods: number;
}

export type CorrelationData = {
  data: CorrelationDataPoint[];
  aggregationPeriod: string;
  correlationMetric: string;
};

export type CorrelationDataPoint = {
  title: string;
  pearson_value: number;
  p_value: number;
  lag: number;
  input_data: number[];
  dataset_data: number[];
  dates: string[];
  source?: string;
  description?: string;
  internal_name: string;
};

const Results: React.FC<MyComponentProps> = ({ data, lagPeriods }) => {
  const [checkedRows, setCheckedRows] = useState<Set<number>>(new Set());

  const toggleCheckbox = (id: number, checked: boolean) => {
    const newCheckedRows = new Set(checkedRows);
    if (checked) {
      newCheckedRows.add(id);
    } else if (newCheckedRows.has(id)) {
      // Delete if the row exists and checked off
      newCheckedRows.delete(id);
    }

    setCheckedRows(newCheckedRows);
  };

  useEffect(() => {
    setCheckedRows(new Set());
  }, [data]);

  return (
    <>
      <div className="border-white">
        <Table className="w-full">
          <TableCaption>Top Correlations with the data.</TableCaption>
          <TableHeader>
            <TableRow className="hover:bg-inherit">
              <TableHead />
              <TableHead className="w-[100px]">Table Name</TableHead>
              {lagPeriods > 0 && <TableHead>Lag</TableHead>}
              <TableHead>Correlation</TableHead>
              <TableHead />
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody className="">
            {data?.data?.map((dp, index) => (
              <ResultsRow
                dp={dp}
                lagPeriods={lagPeriods}
                key={`${dp.title}-${dp.lag}`}
                index={index}
                toggleCheckbox={toggleCheckbox}
              />
            ))}
          </TableBody>
        </Table>
      </div>

      {checkedRows.size > 0 && (
        <div className="sticky bottom-0 py-2 flex flex-row justify-end backdrop-blur">
          <IndexModal data={data} checkedRows={checkedRows} />
          <Button
            className="mx-8 bg-blue-800 text-white"
            onClick={() =>
              exportMultipleToExcel(
                data.data.filter((_, index) => checkedRows.has(index)),
              )
            }
            disabled={checkedRows.size === 0}
          >
            Download
          </Button>
        </div>
      )}
    </>
  );
};

export default Results;
