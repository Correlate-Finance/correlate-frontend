import React from 'react';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface MyComponentProps {
  data: string[][];
  tab: string;
}

const InputData: React.FC<MyComponentProps> = ({ data, tab }) => {
  let USDollar = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  return (
    <>
      <h2 className="dark:text-white text-center">
        {tab === 'Automatic' ? 'Revenue' : 'Input Data'}
      </h2>
      <div className="dark:text-white border-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Date</TableHead>
              <TableHead>Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((dp) => (
              <TableRow key={dp[0]}>
                <TableCell className="font-medium w-min whitespace-nowrap">
                  {dp[0]}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {USDollar.format(Number(dp?.[1]?.replace(',', '')))}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default InputData;
