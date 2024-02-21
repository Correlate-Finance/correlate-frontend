import {
  Table,
  TableBody,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import React from 'react';
import IndexModal from './IndexModal';
import ResultsRow from './ResultsRow';
import { Button } from './ui/button';

interface MyComponentProps {
  data: CorrelationDataPoint[];
  lagPeriods: number;
}

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
  return (
    <>
      <div className="flex flex-row gap-1">
        <h2 className="dark:text-white text-center flex-1">Correlations</h2>
        <IndexModal />
        <Button className="mx-8 bg-blue-800 text-white" disabled>
          Download
        </Button>
      </div>
      <div className="dark:text-white border-white">
        <Table>
          <TableCaption>Top Correlations with the data.</TableCaption>
          <TableHeader>
            <TableRow className="hover:bg-inherit">
              <TableHead className="w-[100px]">Table Name</TableHead>
              {lagPeriods > 0 && <TableHead>Lag</TableHead>}
              <TableHead>Correlation</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="[&>*]:whitespace-nowrap">
            {data.map((dp) => (
              <ResultsRow
                dp={dp}
                lagPeriods={lagPeriods}
                key={`${dp.title}-${dp.lag}`}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default Results;
