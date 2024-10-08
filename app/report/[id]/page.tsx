'use client';
import {
  addOrRemoveWatchlist,
  fetchWatchlistedRows,
  getReport,
} from '@/app/api/actions';
import { CorrelationDataPoint, Report } from '@/app/api/schema';
import ExpandableText from '@/components/ExpandableText';
import DoubleLineChart from '@/components/chart/DoubleLineChart';
import { useToast } from '@/components/ui/use-toast';
import { convertToGraphData, correlationCoefficient } from '@/lib/utils';
import { BellIcon } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
type TProps = {
  params: {
    id: string;
  };
};

export default function ReportPage({ params }: Readonly<TProps>) {
  const [report, setReport] = useState<Report>();
  const { toast } = useToast();
  const [correlations, setCorrelations] = useState<number[]>([]);
  const [graphData, setGraphData] = useState<any[][]>([[]]);
  const [watchlistedRows, setWatchlistedRows] = useState<boolean[]>([]);

  useEffect(() => {
    if (!report) return;
    setCorrelations(report.report_data.map((dp) => dp.pearson_value));
    setGraphData(report.report_data.map((dp) => convertToGraphData(dp)));

    const datasetTitles = report?.report_data.map((dp) => dp.title);
    if (!datasetTitles) return;
    const responseData = fetchWatchlistedRows(datasetTitles);
    responseData.then((data) => {
      setWatchlistedRows(data.watchlisted);
    });
  }, [report]);

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

  const onBrushChange = useCallback((dp: CorrelationDataPoint, i: number) => {
    return ({
      startIndex,
      endIndex,
    }: {
      startIndex?: number;
      endIndex?: number;
    }) => {
      const X = dp.dataset_data.slice(
        startIndex,
        endIndex ? endIndex - dp.lag + 1 : dp.dataset_data.length - dp.lag,
      );
      const Y = dp.input_data.slice(
        startIndex ? startIndex + dp.lag : dp.lag,
        endIndex ? endIndex + 1 : dp.input_data.length,
      );
      const newCorrelation = correlationCoefficient(X, Y);
      setCorrelations((prev) => {
        const newCorrelations = [...prev];
        newCorrelations[i] = newCorrelation;
        return newCorrelations;
      });
    };
  }, []);

  return (
    <div className="flex max-w-[800px] mx-auto flex-col justify-center">
      <h1 className="text-3xl font-bold text-center my-6 underline">
        AI generated report for {report?.name}
      </h1>
      <ExpandableText text={`Company Description: ${report?.description}`} />

      <ul>
        {report?.report_data.map((dp, i) => (
          <li className="my-4" key={i}>
            <div className="flex flex-row gap-1 font-bold">
              <BellIcon
                className="h-6 cursor-pointer hover:text-green-400 transition-colors duration-300 ease-in-out"
                fill={watchlistedRows[i] ? '#166534' : 'none'}
                stroke={watchlistedRows[i] ? '#166534' : 'currentColor'}
                onClick={() => {
                  toast({
                    title: watchlistedRows[i]
                      ? 'Disabled Alerts for'
                      : 'Enabled Alerts for',
                    description: `${dp.title}`,
                  });
                  addOrRemoveWatchlist(watchlistedRows[i], dp.title);
                  setWatchlistedRows((prev) => {
                    const newWatchlistedRows = [...prev];
                    newWatchlistedRows[i] = !watchlistedRows[i];
                    return newWatchlistedRows;
                  });
                }}
              />
              <Link
                className="hover:underline"
                href={`/data/${dp.internal_name}`}
              >{`${i + 1}: ${dp.title}`}</Link>
            </div>
            <div className="flex flex-col gap-2 items-center">
              <div className="w-[80%]">
                {graphData[i] && (
                  <DoubleLineChart
                    data={graphData[i]}
                    syncId="sync"
                    correlation={correlations[i]?.toFixed(3)}
                    onBrushChange={onBrushChange(dp, i)}
                  />
                )}
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
