import {
  Table,
  TableBody,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import React from 'react';
import ResultsRow from './ResultsRow';

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
      <h2 className="text-white text-center">Correlations</h2>
      <div className="text-white border-white">
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
