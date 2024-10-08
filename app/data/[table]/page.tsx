'use client';

import BrushWrapper from '@/components/chart/BrushWrapper';
import { Button } from '@/components/ui/button';
import { MultiSelect } from '@/components/ui/multiselect';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import SkeletonComp from '@/components/ui/skeleton';
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { exportToExcel, formatNumber, formatPercentage } from '@/lib/utils';
import dayjs from 'dayjs';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import {
  useAllYearsArray,
  useFetchData,
  useFilterData,
  useMetadata,
} from './hooks';
import { MonthlySeasonality, calculateSeasonality } from './seasonality';

const BarLineChart = dynamic(() => import('@/components/chart/BarLineChart'), {
  loading: () => <SkeletonComp count={1} width="30vw" height="30vh" inline />,
});
const BarLineChartFutureExtrapolation = dynamic(
  () => import('@/components/chart/BarLineChartFutureExtrapolation'),
  {
    loading: () => <SkeletonComp count={1} width="30vw" height="30vh" inline />,
  },
);
const Table = dynamic(
  () => import('@/components/ui/table').then((mod) => mod.Table),
  {
    loading: () => <SkeletonComp count={5} />,
  },
);

type TActiveStack = 'Stack2Y' | 'Stack3Y' | 'Stack4Y' | 'Stack5Y';
type TActiveTab = 'Raw' | 'Seasonal';
type TProps = {
  params: {
    table: string;
  };
};

export default function DataTrendPage({ params }: Readonly<TProps>) {
  const { data, loading } = useFetchData(params);
  const allYearsArray = useAllYearsArray(data);
  const [activeStack, setActiveStack] = useLocalStorage(
    'activeStack',
    'Stack3Y',
  );
  const [activeTab, setActiveTab] = useLocalStorage('activeTab', 'Raw');

  const { filteredDataRaw, filteredDataSeasonal } = useFilterData(data);
  const metadata = useMetadata(params);
  const [seasonalMonthlyAverage, setSeasonalMonthlyAverage] = useState<
    MonthlySeasonality[]
  >([]);

  const [selectedYears, setSelectedYears] = useState<string[]>([]);
  useEffect(() => {
    setSelectedYears(allYearsArray.slice(0, 5));
  }, [allYearsArray]);

  useEffect(() => {
    const newSeasonalAverages = calculateSeasonality(
      filteredDataSeasonal,
      selectedYears,
    );
    setSeasonalMonthlyAverage(newSeasonalAverages);
    filteredDataSeasonal.map((dp) => {
      dp.DeltaSeasonality =
        newSeasonalAverages.length > 0 && dp.MoMGrowth
          ? dp.MoMGrowth -
            newSeasonalAverages[11 - dayjs(dp.Date).month()].value
          : dp.DeltaSeasonality;
    });
  }, [selectedYears, filteredDataSeasonal]);

  return (
    <div>
      <h1 className="text-center text-2xl">{metadata.title}</h1>
      <Button
        className="bg-blue-800 my-2 mx-4"
        onClick={() => exportToExcel(data, params.table)}
      >
        Export to excel
      </Button>
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as TActiveTab)}
        className="flex flex-col items-center my-4"
      >
        <TabsList className="flex flex-row w-min">
          <TabsTrigger value="Raw">Raw</TabsTrigger>
          <TabsTrigger value="Seasonal">Seasonal</TabsTrigger>
        </TabsList>
        <TabsContent value="Raw">
          <div className="flex justify-between items-center">
            <div className="flex flex-row gap-4 mb-4 items-center">
              <p className="text-center">Multi-year stack</p>
              <div className="w-30">
                <Select
                  onValueChange={(e) => setActiveStack(e as TActiveStack)}
                  value={activeStack}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Stack2Y">2Y Stack</SelectItem>
                    <SelectItem value="Stack3Y">3Y Stack</SelectItem>
                    <SelectItem value="Stack4Y">4Y Stack</SelectItem>
                    <SelectItem value="Stack5Y">5Y Stack</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          {data && !loading ? (
            <div>
              <div className="flex flex-row justify-center">
                <div className="flex flex-row justify-center gap-10">
                  <BarLineChart
                    data={filteredDataRaw}
                    barChartKey="Value"
                    barChartKeyFormat="number"
                    lineChartKey="YoYGrowth"
                    lineChartKeyFormat="percentage"
                    syncId="syncId"
                    title="Raw data vs Y/Y growth"
                  />
                  <BarLineChart
                    data={filteredDataRaw}
                    barChartKey="Value"
                    barChartKeyFormat="number"
                    lineChartKey={activeStack}
                    lineChartKeyFormat="percentage"
                    syncId="syncId"
                    title={`Raw data vs ${activeStack}`}
                  />
                </div>
                <BarLineChartFutureExtrapolation
                  data={filteredDataRaw}
                  barChartKey={activeStack}
                  barChartKeyFormat="percentage"
                  lineChartKey="YoYGrowth"
                  lineChartKeyFormat="percentage"
                  title={`CAGR vs Y/Y growth for ${activeStack}`}
                />
              </div>
              <div className="flex flex-col items-center w-2/3">
                <BrushWrapper data={filteredDataRaw} syncId="syncId" />
              </div>
              <div className="border-white">
                <div className="w-full">
                  <Table className="border-white">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[20px]">Index</TableHead>
                        <TableHead className="w-[100px]">Date</TableHead>
                        <TableHead className="w-[100px]">Value</TableHead>
                        <TableHead className="w-[100px]">T3M</TableHead>
                        <TableHead className="w-[100px]">T6M</TableHead>
                        <TableHead className="w-[100px]">T12M</TableHead>
                        <TableHead className="w-[100px]">YoY Growth</TableHead>
                        <TableHead className="w-[100px]">
                          T3M YoY Growth
                        </TableHead>
                        <TableHead className="w-[100px]">
                          T6M YoY Growth
                        </TableHead>
                        <TableHead className="w-[100px]">
                          T12M YoY Growth
                        </TableHead>
                        <TableHead className="w-[100px]">
                          {activeStack}
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                  </Table>
                </div>
                <div className="max-h-[90vh] overflow-y-auto">
                  <Table className="w-full">
                    <TableBody>
                      {data.map((dp, index) => {
                        return (
                          <TableRow key={index}>
                            <TableCell className="w-[20px]">{index}</TableCell>
                            <TableCell className="whitespace-nowrap w-[100px]">
                              {dp.Date}
                            </TableCell>
                            <TableCell className="whitespace-nowrap w-[100px]">
                              {formatNumber(dp.Value)}
                            </TableCell>
                            <TableCell className="whitespace-nowrap w-[100px]">
                              {formatNumber(dp.T3M)}
                            </TableCell>
                            <TableCell className="whitespace-nowrap w-[100px]">
                              {formatNumber(dp.T6M)}
                            </TableCell>
                            <TableCell className="whitespace-nowrap w-[100px]">
                              {formatNumber(dp.T12M)}
                            </TableCell>
                            <TableCell className="w-[100px]">
                              {formatPercentage(dp.YoYGrowth)}
                            </TableCell>
                            <TableCell className="w-[100px]">
                              {formatPercentage(dp.T3M_YoYGrowth)}
                            </TableCell>
                            <TableCell className="w-[100px]">
                              {formatPercentage(dp.T6M_YoYGrowth)}
                            </TableCell>
                            <TableCell className="w-[100px]">
                              {formatPercentage(dp.T12M_YoYGrowth)}
                            </TableCell>
                            <TableCell className="w-[100px]">
                              {formatPercentage(dp[activeStack] as number)}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          ) : (
            <SkeletonComp count={3} width="30vw" height="30vh" inline />
          )}
        </TabsContent>
        <TabsContent value="Seasonal">
          {data && !loading ? (
            <div className="mt-8">
              <div className="flex flex-row justify-end">
                <BarLineChart
                  data={filteredDataSeasonal}
                  barChartKey="MoMGrowth"
                  barChartKeyFormat="percentage"
                  lineChartKey="DeltaSeasonality"
                  lineChartKeyFormat="percentage"
                  title="MoM Growth vs Delta Seasonality"
                />
                <div className="flex flex-col mb-4 items-end">
                  <p className="text-center mr-12 mb-2">Year Selector</p>
                  <div className="w-[200px]">
                    <MultiSelect
                      options={allYearsArray.map((year) => {
                        return { value: year, label: year };
                      })}
                      selected={selectedYears}
                      onChange={setSelectedYears}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
              <div className="border-white flex justify-between gap-20">
                <div>
                  <div className="w-full">
                    <Table className="border-white">
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[20px]">Index</TableHead>
                          <TableHead className="w-[120px]">Date</TableHead>
                          <TableHead className="w-[100px]">Value</TableHead>
                          <TableHead className="w-[50px]">MoM Growth</TableHead>
                          <TableHead className="w-[75px]">
                            Delta Seasonality
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                    </Table>
                  </div>
                  <div className="max-h-[90vh] overflow-y-auto">
                    <Table className="w-full">
                      <TableBody>
                        {filteredDataSeasonal.map((dp, index) => {
                          // If we have calculated seasonal data, use that to calculate delta seasonality
                          return (
                            <TableRow key={index}>
                              <TableCell className="w-[20px]">
                                {index}
                              </TableCell>
                              <TableCell className="w-[120px]">
                                {dp.Date}
                              </TableCell>
                              <TableCell className="w-[100px]">
                                {dp.Value}
                              </TableCell>
                              <TableCell className="w-[50px]">
                                {formatPercentage(dp.MoMGrowth)}
                              </TableCell>
                              <TableCell className="w-[75px]">
                                {formatPercentage(dp.DeltaSeasonality)}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </div>
                <div>
                  <Table className="border-white w-full">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[150px]">Month</TableHead>
                        <TableHead className="w-[100px]">Average MoM</TableHead>
                      </TableRow>
                    </TableHeader>
                  </Table>
                  <div className="max-h-[90vh] overflow-y-auto">
                    <Table className="w-full">
                      <TableBody>
                        {seasonalMonthlyAverage.map((dp, index) => {
                          return (
                            <TableRow key={index}>
                              <TableCell className="whitespace-nowrap w-[150px]">
                                {dp.month}
                              </TableCell>
                              <TableCell className="whitespace-nowrap w-[100px]">
                                {formatPercentage(dp.value)}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <SkeletonComp count={1} width="50vw" height="50vh" inline />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
