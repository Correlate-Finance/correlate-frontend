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
}

const InputData: React.FC<MyComponentProps> = ({ data }) => {
  let USDollar = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  return (
    <div>
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
                {USDollar.format(
                  Number(
                    dp?.[1]
                      ?.replaceAll(',', '')
                      .replaceAll('$', '')
                      .replaceAll('%', ''),
                  ),
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default InputData;
