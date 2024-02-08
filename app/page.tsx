'use client';

import { ReloadIcon } from '@radix-ui/react-icons';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import React, { FormEvent, useReducer } from 'react';
import { useState, useEffect } from 'react';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Results, { CorrelationDataPoint } from '@/components/Results';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import InputData from '@/components/InputData';
import { RevenueResponseSchema } from './api/schema';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const Page = () => {
  const [isLoading, setLoading] = useState(false);
  const [hasData, setHasData] = useState(false);
  const [dataArray, setDataArray] = useState<CorrelationDataPoint[]>(
    []
  );
  const [revenueData, setRevenueData] = useState<string[][]>();
  const [fiscalYearEnd, setFiscalYearEnd] =
    useState<string>('December');
  const [timeIncrement, setTimeIncrement] =
    useState<string>('Quarterly');
  const [lagPeriods, setLagPeriods] = useState<number>(0);

  const [inputData, setInputData] = useState('');

  const formSchema = z.object({
    ticker: z.string().min(2, {
      message: 'Stock Ticker must be at least 2 characters.',
    }),
    startYear: z.coerce
      .number()
      .max(2023, { message: 'Year needs to be lower than 2023' })
      .min(2000, { message: 'Year needs to be higher than 2000' }),
    aggregationPeriod: z.string(),
    lagPeriods: z.coerce.number(),
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    getRevenueData(values);
    setLoading(true);
    setLagPeriods(values.lagPeriods);

    const res = await fetch(
      `api/fetch?stock=${values.ticker}&startYear=${values.startYear}&aggregationPeriod=${values.aggregationPeriod}&lagPeriods=${values.lagPeriods}`,
      {
        credentials: 'include',
      }
    );
    const jsonData = await res.json();

    setLoading(false);
    const arrData = jsonData.data.data as CorrelationDataPoint[];
    setDataArray(arrData);
    setHasData(true);
  }

  async function getRevenueData(values: z.infer<typeof formSchema>) {
    setLoading(true);

    const res = await fetch(
      `api/revenue?stock=${values.ticker}&startYear=${values.startYear}&aggregationPeriod=${values.aggregationPeriod}`,
      {
        credentials: 'include',
      }
    );
    const jsonData = await res.json();

    const parsed = RevenueResponseSchema.parse(jsonData.data);

    const parsedData = parsed.map((x) => [x.date, x.value]);
    setRevenueData(parsedData);
  }

  function updateInputText(
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) {
    e.preventDefault();
    setInputData(e.target.value);
  }

  async function correlateInputText() {
    setLoading(true);

    const res = await fetch(
      `api/correlateinputdata?fiscalYearEnd=${fiscalYearEnd}&timeIncrement=${timeIncrement}&lagPeriods=${lagPeriods}`,
      {
        method: 'POST',
        body: inputData,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
        },
        credentials: 'include',
      }
    );
    const jsonData = await res.json();

    setLoading(false);
    const arrData = jsonData.data.data as CorrelationDataPoint[];
    setDataArray(arrData);
    setHasData(true);
  }

  function generateTabularData() {
    var rows = inputData.split('\n');

    var table: string[][] = [];

    for (var y in rows) {
      var cells = rows[y].split('\t');
      table.push(cells);
    }

    // Transpose table
    if (table.length == 2) {
      table = table[0].map((_, colIndex) =>
        table.map((row) => row[colIndex])
      );
    }
    return table;
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ticker: 'AAPL',
      startYear: 2010,
      aggregationPeriod: 'Annually',
      lagPeriods: 0,
    },
  });

  return (
    <main className="flex flex-col w-full items-center">
      <Card className="bg-[#1b1b26] flex flex-col justify-center m-4 w-3/4 border-neutral-700">
        <CardContent>
          <Tabs
            defaultValue="Manual"
            className="flex flex-col items-center my-4"
          >
            <TabsList className="flex flex-row w-min">
              <TabsTrigger value="Manual">Manual</TabsTrigger>
              <TabsTrigger value="Automatic">Automatic</TabsTrigger>
            </TabsList>
            <TabsContent value="Automatic">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="flex md:flex-row flex-col justify-center items-center w-full [&>*]:mx-2 [&>*]:whitespace-nowrap"
                >
                  <FormField
                    control={form.control}
                    name="ticker"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white text-opacity-80">
                          Ticker
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="AAPL" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="startYear"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white text-opacity-80">
                          Start Year
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="2010" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="aggregationPeriod"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white text-opacity-80">
                          Aggregation Period
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue="Annually"
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Annually">
                              Annually
                            </SelectItem>
                            <SelectItem value="Quarterly">
                              Quarterly
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lagPeriods"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white text-opacity-80">
                          Lag Periods
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue="0"
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="0">0</SelectItem>
                            <SelectItem value="1">1</SelectItem>
                            <SelectItem value="2">2</SelectItem>
                            <SelectItem value="3">3</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    className="mt-4 bg-green-600 hover:bg-green-900 self-center"
                  >
                    {' '}
                    {isLoading && (
                      <ReloadIcon className="mr-2 h-4 w-4 animate-spin " />
                    )}{' '}
                    Correlate
                  </Button>
                </form>
              </Form>
            </TabsContent>
            <TabsContent
              value="Manual"
              className="flex flex-col md:flex-row justify-around [&>*]:mx-2 [&>*]:whitespace-nowrap"
            >
              <div className="">
                <p className="text-white text-sm mb-2 text-opacity-80">
                  Input Data
                </p>
                <Textarea
                  onChange={updateInputText}
                  placeholder="Paste excel data here"
                  className=""
                />
              </div>
              <div>
                <p className="text-white text-sm mb-2 text-opacity-80">
                  Fiscal Year End
                </p>
                <Select
                  onValueChange={(e: string) => setFiscalYearEnd(e)}
                  defaultValue="December"
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="January">January</SelectItem>
                    <SelectItem value="February">February</SelectItem>
                    <SelectItem value="March">March</SelectItem>
                    <SelectItem value="April">April</SelectItem>
                    <SelectItem value="May">May</SelectItem>
                    <SelectItem value="June">June</SelectItem>
                    <SelectItem value="July">July</SelectItem>
                    <SelectItem value="August">August</SelectItem>
                    <SelectItem value="September">
                      September
                    </SelectItem>
                    <SelectItem value="October">October</SelectItem>
                    <SelectItem value="November">November</SelectItem>
                    <SelectItem value="December">December</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <p className="text-white text-sm mb-2 text-opacity-80">
                  Aggregation Period
                </p>
                <Select
                  onValueChange={(e: string) => setTimeIncrement(e)}
                  defaultValue="Quarterly"
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Quarterly">
                      Quarterly
                    </SelectItem>
                    <SelectItem value="Annually">Annually</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <p className="text-white text-sm mb-2 text-opacity-80">
                  Lag Periods
                </p>
                <Select
                  onValueChange={(e: string) =>
                    setLagPeriods(Number(e))
                  }
                  defaultValue="0"
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">0</SelectItem>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <p className="text-[#1b1b26] text-sm mb-2">button</p>
                <Button
                  onClick={correlateInputText}
                  className="top-4 bg-green-600 hover:bg-green-900"
                >
                  {' '}
                  {isLoading && (
                    <ReloadIcon className="mr-2 h-4 w-4 animate-spin " />
                  )}{' '}
                  Correlate
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      {/* <Separator orientation="vertical" className="my-40 w-4 border-white" /> */}
      <div className="m-5 flex flex-row justify-between w-3/4">
        <div className="w-min">
          {(inputData && (
            <InputData data={generateTabularData()} />
          )) ||
            (revenueData && <InputData data={revenueData} />)}
        </div>
        <Separator
          orientation="vertical"
          className="border-neutral-700 w-[10px] h-full"
        />
        <div className="w-2/3">
          {hasData && (
            <Results data={dataArray} lagPeriods={lagPeriods} />
          )}
        </div>
      </div>
    </main>
  );
};

export default Page;
