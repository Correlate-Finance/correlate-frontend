'use client';

import { DataTrendPoint } from '@/app/api/schema';
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
import { exportToExcel } from '@/lib/utils';
import dayjs from 'dayjs';
import { useEffect, useMemo, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

type TActiveStack = 'Stack2Y' | 'Stack3Y' | 'Stack4Y' | 'Stack5Y';
type TActiveTab = 'Raw' | 'Seasonal';

export default function Page({ params }: { params: { table: string } }) {
  const [data, setData] = useState<DataTrendPoint[]>([]);
  const [activeStack, setActiveStack] = useState<TActiveStack>('Stack3Y');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<TActiveTab>('Raw');
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
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
      .then((json) => setData(JSON.parse(json.data).toReversed()))
      .catch((err) => {
        alert('Error: ' + err);
      });
  }, [params.table]);

  // Load default state from local storage
  useEffect(() => {
    const activeTab = localStorage.getItem('activeTab');
    if (activeTab) {
      setActiveTab(activeTab as TActiveTab);
    }
    const activeStack = localStorage.getItem('activeStack');
    if (activeStack) {
      setActiveStack(activeStack as TActiveStack);
    }
    const dateRange = localStorage.getItem('dateRange');
    if (dateRange) {
      setDateRange(JSON.parse(dateRange));
    }
    const selectedYear = localStorage.getItem('selectedYear');
    if (selectedYear) {
      setSelectedYear(selectedYear);
    }
  }, []);

  const filteredDataRaw = useMemo(() => {
    if (startDate && endDate) {
      return data.filter((dp) => {
        return (
          dayjs(dp.Date).isAfter(startDate) && dayjs(dp.Date).isBefore(endDate)
        );
      });
    }
    return data;
  }, [data, startDate, endDate]);

  const lastFiveYearsArray = useMemo(() => {
    const lastFiveYears = [];
    for (let i = 0; i < 5; i++) {
      lastFiveYears.push(dayjs().subtract(i, 'year').format('YYYY'));
    }
    return lastFiveYears;
  }, []);

  const filteredDataSeasonal = useMemo(() => {
    if (selectedYear === 'all') {
      return data;
    }
    return data.filter((dp) => {
      return dayjs(dp.Date).format('YYYY') === selectedYear;
    });
  }, [data, selectedYear]);

  const handleActiveTab = (e: TActiveTab) => {
    setActiveTab(e);
    localStorage.setItem('activeTab', e);
  };

  const handleActiveStack = (e: string) => {
    setActiveStack(e as 'Stack2Y' | 'Stack3Y' | 'Stack4Y' | 'Stack5Y');
    localStorage.setItem('activeStack', e);
  };

  const handleDateRange = (update: any) => {
    setDateRange(update);
    localStorage.setItem('dateRange', JSON.stringify(update));
  };

  const handleChangeSelectedYear = (e: string) => {
    setSelectedYear(e);
    localStorage.setItem('selectedYear', e);
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
        onValueChange={(value) => handleActiveTab(value as TActiveTab)}
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
                  onValueChange={(e: string) => handleActiveStack(e)}
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
              <div className="flex flex-row justify-start">
                <BarLineChart
                  data={filteredDataRaw}
                  barChartKey="Value"
                  lineChartKey="YoYGrowth"
                />
                <BarLineChart
                  data={filteredDataRaw}
                  barChartKey="Value"
                  lineChartKey={activeStack}
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
                      <TableHead>{activeStack}</TableHead>
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
                          <TableCell>{formatter(dp[activeStack])}</TableCell>
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
        </TabsContent>
        <TabsContent value="Seasonal">
          <div className="flex flex-row gap-4 mb-4 items-center">
            <p className="text-white text-center">Year Selector</p>
            <div className="w-30">
              <Select
                onValueChange={(e: string) => handleChangeSelectedYear(e)}
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
                  lineChartKey="DeltaSeasonality"
                />
              </div>
              <div className="text-white border-white flex justify-between gap-20">
                <div>
                  <Table className="border-white w-min">
                    <caption>Input Data.</caption>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Index</TableHead>
                        <TableHead className="w-[100px]">Date</TableHead>
                        <TableHead>Value</TableHead>
                        <TableHead>MoM Growth</TableHead>
                        <TableHead>Delta Seasonality</TableHead>
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
                            <TableCell>{formatter(dp.MoMGrowth)}</TableCell>
                            <TableCell>
                              {formatter(dp.DeltaSeasonality)}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
                <div>
                  <Table className="border-white w-min">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">Month</TableHead>
                        <TableHead>Average MoM</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.slice(data.length - 12).map((dp, index) => {
                        return (
                          <TableRow key={index}>
                            <TableCell className="whitespace-nowrap">
                              {dayjs(dp.Date).format('MMMM')}
                            </TableCell>
                            <TableCell className="whitespace-nowrap">
                              {formatter(dp.averageMoM)}
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
      </Tabs>
    </div>
  );
}
