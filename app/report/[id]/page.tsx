'use client';

import { getReport } from '@/app/api/actions';
import { Report } from '@/app/api/schema';
import DoubleLineChart from '@/components/chart/DoubleLineChart';
import { useToast } from '@/components/ui/use-toast';
import { convertToGraphData } from '@/lib/utils';
import { useEffect, useState } from 'react';

type TProps = {
  params: {
    id: string;
  };
};

export default function ReportPage({ params }: Readonly<TProps>) {
  const [report, setReport] = useState<Report>();
  const { toast } = useToast();

  useEffect(() => {
    getReport(params.id)
      .then((data) => {
        setReport(data);
      })
      .catch(() => {
        toast({
          title: 'Error',
          description: 'An error occurred while fetching the report',
        });
      });
  }, [params.id, toast]);

  return (
    <div className="flex max-w-[800px] mx-auto flex-col justify-center">
      <h1 className="text-3xl font-bold text-center my-6 underline">
        AI generated report for ticker {report?.parameters.ticker}
      </h1>
      <p>Company Description: {report?.description}</p>

      <ul>
        {report?.report_data.map((dp, i) => (
          <li className="my-4" key={i}>
            <div className="font-bold">{`${i + 1}: ${dp.title}`}</div>
            <div className="flex flex-col gap-2">
              <div className="h-[60vh]">
                <DoubleLineChart
                  data={convertToGraphData(dp)}
                  syncId="sync"
                  correlation={dp.pearson_value.toString()}
                />
              </div>
              <p className="dark:text-gray-300 text-gray-400 text-center">
                {dp.source}: {dp.url}
              </p>
              <p>
                <strong>Rationale:</strong> {report.llm_response[i].rationale}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
