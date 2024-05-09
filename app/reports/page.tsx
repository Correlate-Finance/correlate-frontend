'use client';

import { Report } from '@/app/api/schema';
import GenerateAutomaticReportModal from '@/components/GenerateAutomaticReportModal';
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
import { getAllReports } from '../api/actions';

function time2TimeAgo(ts: number) {
  // This function computes the delta between the
  // provided timestamp and the current time, then test
  // the delta for predefined ranges.

  var d = new Date(); // Gets the current time
  var nowTs = Math.floor(d.getTime() / 1000); // getTime() returns milliseconds, and we need seconds, hence the Math.floor and division by 1000
  var seconds = nowTs - ts;

  // more that two days
  if (seconds > 2 * 24 * 3600) {
    return new Date(ts * 1000).toLocaleDateString();
  }
  // a day
  if (seconds > 24 * 3600) {
    return 'yesterday';
  }

  if (seconds > 3600) {
    return Math.floor(seconds / 3600) + ' hours ago';
  }
  if (seconds > 1800) {
    return 'Half an hour ago';
  }
  if (seconds > 60) {
    return Math.floor(seconds / 60) + ' minutes ago';
  }
  return 'Just now';
}

export default function ReportsPage() {
  const [data, setData] = useState<Report[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const fetchedData = await getAllReports();
      setData(fetchedData.reverse());
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
              <TableCell>
                {time2TimeAgo(
                  new Date(Date.parse(report.created_at)).getTime() / 1000,
                )}
              </TableCell>
              <TableCell className="line-clamp-2 max-h-[80%]">
                {report.description}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="sticky bottom-4 flex flex-row mx-8 justify-end gap-4">
        <GenerateAutomaticReportModal />
      </div>
    </div>
  );
}
