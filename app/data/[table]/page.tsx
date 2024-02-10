'use client';

import { DataTrendPoint } from '@/app/api/schema';
import BarLineChart from '@/components/chart/BarLineChart';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useEffect, useState } from 'react';

export default function Page({ params }: { params: { table: string } }) {
  const [data, setData] = useState<DataTrendPoint[]>();
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'percent',
    maximumFractionDigits: 2,
  }).format;

  useEffect(() => {
    fetch(`/api/dataset/`, {
      method: 'POST',
      body: params.table,
    })
      .then((res) => res.json())
      .then((json) => setData(JSON.parse(json.data).toReversed()));
  }, [params.table]);

  return (
    <>
      {data ? (
        <div>
          <div className="flex flex-row justify-start">
            <BarLineChart
              data={data.slice(6, 26)}
              barChartKey="Value"
              lineChartKey="YoYGrowth"
            />
            <BarLineChart
              data={data.slice(6, 26)}
              barChartKey="Value"
              lineChartKey="Stack3Y"
            />
          </div>
          <h2 className="text-white text-center">Input Data</h2>
          <div className="text-white border-white">
            <Table className="border-white w-min">
              <caption>Input Data.</caption>
              <TableHeader>
                <TableRow>
                  <TableHead>Index</TableHead>
                  <TableHead className="w-[100px]">Date</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>T3M</TableHead>
                  <TableHead>T6M</TableHead>
                  <TableHead>T12M</TableHead>
                  <TableHead>YoY Growth</TableHead>
                  <TableHead>T3M YoY Growth</TableHead>
                  <TableHead>T6M YoY Growth</TableHead>
                  <TableHead>T12M YoY Growth</TableHead>
                  <TableHead>Stack2Y</TableHead>
                  <TableHead>Stack3Y</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((dp, index) => {
                  return (
                    <TableRow key={index}>
                      <TableCell>{index}</TableCell>
                      <TableCell className="whitespace-nowrap">
                        {dp.Date}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {dp.Value}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {dp.T3M}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {dp.T6M}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {dp.T12M}
                      </TableCell>
                      <TableCell>{formatter(dp.YoYGrowth)}</TableCell>
                      <TableCell>{formatter(dp.T3M_YoYGrowth)}</TableCell>
                      <TableCell>{formatter(dp.T6M_YoYGrowth)}</TableCell>
                      <TableCell>{formatter(dp.T12M_YoYGrowth)}</TableCell>
                      <TableCell>{formatter(dp.Stack2Y)}</TableCell>
                      <TableCell>{formatter(dp.Stack3Y)}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      ) : (
        'Loading...'
      )}
    </>
  );
}
