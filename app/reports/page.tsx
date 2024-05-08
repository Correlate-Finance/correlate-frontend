'use client';

import { Report } from '@/app/api/schema';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { generateAutomaticReport, getAllReports } from '../api/actions';

export default function ReportsPage() {
  const [data, setData] = useState<Report[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const fetchedData = await getAllReports();
      setData(fetchedData);
    };

    fetchData();
  }, []);

  return (
    <div>
      <Table className="mx-8 w-[90%] m-auto">
        <TableHeader>
          <TableRow>
            <TableHead>Index</TableHead>
            <TableHead>Ticker</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Description</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((report, i) => (
            <TableRow
              key={report.id}
              onClick={() => router.push(`/report/${report.id}`)}
              className="cursor-pointer hover:bg-gray-100"
            >
              <TableCell>{i + 1}</TableCell>
              <TableCell>{report.name}</TableCell>
              <TableCell>{report.created_at}</TableCell>
              <TableCell className="line-clamp-2 max-h-[80%]">
                {report.description}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button onClick={() => generateAutomaticReport(['AAPL'])}>
        Generate New Report
      </Button>
    </div>
  );
}
