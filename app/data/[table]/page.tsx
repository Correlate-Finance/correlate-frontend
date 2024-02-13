'use client';

import BarLineChart from '@/components/chart/BarLineChart';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { exportToExcel, formatNumber, formatPercentage } from '@/lib/utils';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
  useFetchData,
  useFilterData,
  useLastFiveYearsArray,
  useLocalStorage,
} from './hooks';

type TActiveStack = 'Stack2Y' | 'Stack3Y';
type TActiveTab = 'Raw' | 'Seasonal';

export default function Page({ params }: { params: { table: string } }) {
  const data = useFetchData(params);
  const lastFiveYearsArray = useLastFiveYearsArray();
  const [activeStack, setActiveStack] = useLocalStorage(
    'activeStack',
    'Stack3Y',
  );
  const [selectedYear, setSelectedYear] = useLocalStorage(
    'selectedYear',
    'all',
  );
  const [activeTab, setActiveTab] = useLocalStorage('activeTab', 'Raw');
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const { filteredDataRaw, filteredDataSeasonal } = useFilterData(
    data,
    startDate,
    endDate,
    selectedYear,
  );

  useEffect(() => {
    const dateRange = localStorage.getItem('dateRange');
    if (dateRange) {
      setDateRange(JSON.parse(dateRange));
    }
  }, []);

  const handleDateRange = (update: any) => {
    setDateRange(update);
    localStorage.setItem('dateRange', JSON.stringify(update));
  };

  return (
    <div>
      <Button
        className="bg-blue-800 my-2 mx-4"
        onClick={() => exportToExcel(data)}
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
              <p className="text-white text-center">Multi-year stack</p>
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
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <DatePicker
                selectsRange={true}
                startDate={startDate}
                endDate={endDate}
                onChange={(update: any) => handleDateRange(update)}
                isClearable={true}
                placeholderText="Date Picker"
                className="bg-white text-black rounded-md p-2 w-60 text-center"
              />
            </div>
          </div>
          {data ? (
            <div>
              <div className="flex flex-row justify-center gap-10">
                <BarLineChart
                  data={filteredDataRaw}
                  barChartKey="Value"
                  barChartKeyFormat="number"
                  lineChartKey="YoYGrowth"
                  lineChartKeyFormat="percentage"
                />
                <BarLineChart
                  data={filteredDataRaw}
                  barChartKey="Value"
                  barChartKeyFormat="number"
                  lineChartKey={activeStack}
                  lineChartKeyFormat="percentage"
                />
              </div>
              <h2 className="text-white text-center">Input Data</h2>
              <div className="text-white border-white">
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
                        <TableHead className="w-[100px]">Stack2Y</TableHead>
                        <TableHead className="w-[100px]">Stack3Y</TableHead>
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
                              {formatPercentage(dp.Stack2Y)}
                            </TableCell>
                            <TableCell className="w-[100px]">
                              {formatPercentage(dp.Stack3Y)}
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
            'Loading...'
          )}
        </TabsContent>
        <TabsContent value="Seasonal">
          <div className="flex flex-row gap-4 mb-4 items-center">
            <p className="text-white text-center">Year Selector</p>
            <div className="w-30">
              <Select
                onValueChange={(e: string) => setSelectedYear(e)}
                value={selectedYear}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {lastFiveYearsArray.map((year, index) => {
                    return (
                      <SelectItem key={index} value={year}>
                        {year}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>
          {data ? (
            <div>
              <div className="flex flex-row justify-center">
                <BarLineChart
                  data={filteredDataSeasonal}
                  barChartKey="MoMGrowth"
                  barChartKeyFormat="percentage"
                  lineChartKey="DeltaSeasonality"
                  lineChartKeyFormat="percentage"
                />
              </div>
              <div className="text-white border-white flex justify-between gap-20">
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
                        {data.map((dp, index) => {
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
                        {data.map((dp, index) => {
                          return (
                            <TableRow key={index}>
                              <TableCell className="whitespace-nowrap w-[150px]">
                                {dayjs(dp.Date).format('MMMM YYYY')}
                              </TableCell>
                              <TableCell className="whitespace-nowrap w-[100px]">
                                {formatPercentage(dp.averageMoM)}
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
            'Loading...'
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
