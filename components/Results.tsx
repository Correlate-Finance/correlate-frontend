import {
  Table,
  TableBody,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import React, { useState } from 'react';
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

  return (
    <>
      <div className="flex flex-row gap-1">
        <h2 className="dark:text-white text-center flex-1">Correlations</h2>
        <IndexModal data={data} checkedRows={checkedRows} />
        <Button className="mx-8 bg-blue-800 text-white" disabled>
          Download
        </Button>
      </div>
      <div className="dark:text-white border-white">
        <Table>
          <TableCaption>Top Correlations with the data.</TableCaption>
          <TableHeader>
            <TableRow className="hover:bg-inherit">
              <TableHead />
              <TableHead className="w-[100px]">Table Name</TableHead>
              {lagPeriods > 0 && <TableHead>Lag</TableHead>}
              <TableHead>Correlation</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="[&>*]:whitespace-nowrap">
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
    </>
  );
};

export default Results;
