'use client';

import InputData from '@/components/InputData';
import Results from '@/components/Results';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import {
  formSchema,
  useCorrelateInputText,
  useSubmitForm,
} from '@/hooks/usePage';
import { zodResolver } from '@hookform/resolvers/zod';
import { ReloadIcon } from '@radix-ui/react-icons';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const Page = () => {
  const [tabValue, setTabValue] = useLocalStorage('tabValue', 'Manual');
  const [inputData, setInputData] = useLocalStorage('inputData', '');
  const [lagPeriods, setLagPeriods] = useLocalStorage<number>('lagPeriods', 0);
  const [highLevelOnly, setHighLevelOnly] = useLocalStorage<boolean>(
    'highLevelOnly',
    false,
  );
  const { onSubmit, loading, dataArray, hasData, revenueData } =
    useSubmitForm();
  const {
    onCHangeFiscalYearEnd,
    onChangeTimeIncrement,
    correlateInputText,
    loading: loadingCorelate,
  } = useCorrelateInputText();

  function updateInputText(e: React.ChangeEvent<HTMLTextAreaElement>) {
    e.preventDefault();
    setInputData(e.target.value);
  }

  function generateTabularData() {
    let rows = inputData.split('\n');

    let table: string[][] = [];

    for (let y in rows) {
      let cells = rows[y].split('\t');
      table.push(cells);
    }

    // Transpose table
    if (table.length == 2) {
      table = table[0].map((_, colIndex) => table.map((row) => row[colIndex]));
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
      highLevelOnly: false,
    },
  });

  return (
    <main className="flex flex-col w-full items-center">
      <Card className="dark:bg-[#1b1b26] flex flex-col justify-center m-4 w-3/4 border-neutral-700">
        <CardContent>
          <Tabs
            value={tabValue}
            className="flex flex-col items-center my-4"
            onValueChange={(e) => setTabValue(e)}
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
                        <FormLabel className="dark:text-white text-opacity-80">
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
                        <FormLabel className="dark:text-white text-opacity-80">
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
                        <FormLabel className="dark:text-white text-opacity-80">
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
                            <SelectItem value="Annually">Annually</SelectItem>
                            <SelectItem value="Quarterly">Quarterly</SelectItem>
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
                        <FormLabel className="dark:text-white text-opacity-80">
                          Lag Periods
                        </FormLabel>
                        <Select
                          onValueChange={(e: string) => {
                            setLagPeriods(Number(e));
                            field.onChange(e);
                          }}
                          value={lagPeriods.toString()}
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
                            <SelectItem value="4">4</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="highLevelOnly"
                    render={({ field }) => (
                      <FormItem>
                        <div className="space-y-0.5">
                          <FormLabel className="dark:text-white text-opacity-80">
                            High Level Datasets
                          </FormLabel>
                        </div>
                        <FormControl>
                          <Switch
                            className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-neutral-400"
                            checked={field.value}
                            onCheckedChange={(e: boolean) => {
                              setHighLevelOnly(e);
                              field.onChange(e);
                            }}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    className="mt-8 bg-green-600 hover:bg-green-900 self-center"
                  >
                    {' '}
                    {loading && (
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
                <p className="dark:text-white text-sm mb-2 text-opacity-80">
                  Input Data
                </p>
                <Textarea
                  onChange={updateInputText}
                  placeholder="Paste excel data here"
                  className=""
                />
              </div>
              <div>
                <p className="dark:text-white text-sm mb-2 text-opacity-80">
                  Fiscal Year End
                </p>
                <Select
                  onValueChange={(e: string) => onCHangeFiscalYearEnd(e)}
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
                    <SelectItem value="September">September</SelectItem>
                    <SelectItem value="October">October</SelectItem>
                    <SelectItem value="November">November</SelectItem>
                    <SelectItem value="December">December</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <p className="dark:text-white text-sm mb-2 text-opacity-80">
                  Aggregation Period
                </p>
                <Select
                  onValueChange={(e: string) => onChangeTimeIncrement(e)}
                  defaultValue="Quarterly"
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Quarterly">Quarterly</SelectItem>
                    <SelectItem value="Annually">Annually</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <p className="dark:text-white text-sm mb-2 text-opacity-80">
                  Lag Periods
                </p>
                <Select
                  onValueChange={(e: string) => setLagPeriods(Number(e))}
                  value={lagPeriods.toString()}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">0</SelectItem>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="4">4</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <p className="dark:text-white text-sm mb-2 text-opacity-80">
                  High Level Datasets
                </p>
                <Switch
                  className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-neutral-400"
                  checked={highLevelOnly}
                  onCheckedChange={setHighLevelOnly}
                />
              </div>
              <div>
                <p className="text-[#1b1b26] text-sm mb-2">button</p>
                <Button
                  onClick={() => correlateInputText(inputData)}
                  className="top-4 bg-green-600 hover:bg-green-900"
                >
                  {' '}
                  {loadingCorelate && (
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
            <InputData data={generateTabularData()} tab={tabValue} />
          )) ||
            (revenueData && <InputData data={revenueData} tab={tabValue} />)}
        </div>
        <div className="w-min">
          {hasData && <Results data={dataArray} lagPeriods={lagPeriods} />}
        </div>
      </div>
    </main>
  );
};

export default Page;
