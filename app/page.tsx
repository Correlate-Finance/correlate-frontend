'use client';

import InputData from '@/components/InputData';
import Results from '@/components/Results';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
  useCorrelateResponseData,
  useSubmitForm,
} from '@/hooks/usePage';
import { ReloadIcon } from '@radix-ui/react-icons';
import DOMPurify from 'isomorphic-dompurify';
import React from 'react';
import { z } from 'zod';

const HomePage = () => {
  const [tabValue, setTabValue] = useLocalStorage('tabValue', 'Manual');
  const [inputData, setInputData] = useLocalStorage('inputData', '');
  const [lagPeriods, setLagPeriods] = useLocalStorage<number>('lagPeriods', 0);
  const [highLevelOnly, setHighLevelOnly] = useLocalStorage<boolean>(
    'highLevelOnly',
    false,
  );
  const [inputDataAutomatic, setInputDataAutomatic] = useLocalStorage<
    z.infer<typeof formSchema>
  >('inputDataAutomatic', {
    ticker: 'AAPL',
    startYear: 2010,
    aggregationPeriod: 'Annually',
    lagPeriods: 0,
    highLevelOnly: false,
    correlationMetric: 'RAW_VALUE',
  });

  const { correlateResponseData, setCorrelateResponseData } =
    useCorrelateResponseData();
  const { onSubmit, loading, hasData, revenueData } = useSubmitForm(
    setCorrelateResponseData,
  );
  const {
    onChangeFiscalYearEnd,
    onChangeTimeIncrement,
    correlateInputText,
    loading: loadingCorelate,
    correlateMetric,
    setCorrelateMetric,
  } = useCorrelateInputText(setCorrelateResponseData);

  async function updateInputText(e: React.ChangeEvent<HTMLTextAreaElement>) {
    e.preventDefault();
    setInputData(e.target.value);
  }

  async function handlePaste(e: React.ClipboardEvent<HTMLTextAreaElement>) {
    e.preventDefault();
    const items = await navigator.clipboard.read();
    const html = await items[0].getType('text/html');
    const htmlText = await html.text();

    let table: string[][] = [];
    const tempContainer = document.createElement('div');
    tempContainer.innerHTML = DOMPurify.sanitize(htmlText, {
      USE_PROFILES: { html: true },
    });
    const tableElement = tempContainer.querySelector('table');

    tableElement?.querySelectorAll('tr').forEach((row) => {
      const rowArray: string[] = [];
      // Iterate over cells in the row
      row.querySelectorAll('td').forEach((cell) => {
        if (cell.textContent) rowArray.push(cell.textContent);
      });
      table.push(rowArray);
    });
    tempContainer.remove();

    setInputData(table.map((row) => row.join('\t')).join('\n'));
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
            <TabsContent
              value="Automatic"
              className="flex flex-col md:flex-row justify-around [&>*]:mx-2 [&>*]:whitespace-nowrap"
            >
              <div>
                <p className="dark:text-white text-sm mb-2 text-opacity-80">
                  Ticker
                </p>
                <Input
                  placeholder="AAPL"
                  onChange={(e) => {
                    setInputDataAutomatic({
                      ...inputDataAutomatic,
                      ticker: e.target.value,
                    });
                  }}
                  defaultValue={inputDataAutomatic.ticker}
                  data-testid="automatic-ticker"
                />
              </div>
              <div>
                <p className="dark:text-white text-sm mb-2 text-opacity-80">
                  Start Year
                </p>
                <Input
                  placeholder="2010"
                  onChange={(e) => {
                    setInputDataAutomatic({
                      ...inputDataAutomatic,
                      startYear: Number(e.target.value),
                    });
                  }}
                  defaultValue={inputDataAutomatic.startYear.toString()}
                  data-testid="automatic-start-year"
                />
              </div>
              <div>
                <p className="dark:text-white text-sm mb-2 text-opacity-80">
                  Aggregation Period
                </p>
                <Select
                  defaultValue={inputDataAutomatic.aggregationPeriod}
                  onValueChange={(e: string) => {
                    setInputDataAutomatic({
                      ...inputDataAutomatic,
                      aggregationPeriod: e,
                    });
                  }}
                >
                  <SelectTrigger data-testid="automatic-aggregation-period">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Annually">Annually</SelectItem>
                    <SelectItem value="Quarterly">Quarterly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <p className="dark:text-white text-sm mb-2 text-opacity-80">
                  Correlation Metric
                </p>
                <Select
                  defaultValue={inputDataAutomatic.correlationMetric}
                  onValueChange={(e: string) => {
                    setInputDataAutomatic({
                      ...inputDataAutomatic,
                      correlationMetric: e,
                    });
                  }}
                >
                  <SelectTrigger data-testid="automatic-correlation-metric">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="RAW_VALUE">Raw Value</SelectItem>
                    <SelectItem value="YOY_GROWTH">Y/Y Growth Rate</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <p className="dark:text-white text-sm mb-2 text-opacity-80">
                  Lag Periods
                </p>
                <Select
                  defaultValue={inputDataAutomatic.lagPeriods.toString()}
                  onValueChange={(e: string) => {
                    setInputDataAutomatic({
                      ...inputDataAutomatic,
                      lagPeriods: Number(e),
                    });
                  }}
                >
                  <SelectTrigger data-testid="automatic-lag-periods">
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
                  checked={inputDataAutomatic.highLevelOnly}
                  onCheckedChange={(e: boolean) => {
                    setInputDataAutomatic({
                      ...inputDataAutomatic,
                      highLevelOnly: e,
                    });
                  }}
                />
              </div>
              <Button
                className="mt-6 bg-green-600 hover:bg-green-900 self-center"
                onClick={() => onSubmit(inputDataAutomatic)}
                data-testid="automatic-correlate-button"
              >
                {' '}
                {loading && (
                  <ReloadIcon className="mr-2 h-4 w-4 animate-spin " />
                )}{' '}
                Correlate
              </Button>
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
                  onPaste={handlePaste}
                  placeholder="Paste excel data here"
                  className=""
                  value={inputData}
                />
              </div>
              <div>
                <p className="dark:text-white text-sm mb-2 text-opacity-80">
                  Fiscal Year End
                </p>
                <Select
                  onValueChange={(e: string) => onChangeFiscalYearEnd(e)}
                  defaultValue="December"
                >
                  <SelectTrigger data-testid="fiscal-year-end">
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
                  <SelectTrigger data-testid="quarterly">
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
                  Correlation Metric
                </p>
                <Select
                  onValueChange={(e: string) => setCorrelateMetric(e)}
                  defaultValue={correlateMetric}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="RAW_VALUE">Raw Value</SelectItem>
                    <SelectItem value="YOY_GROWTH">Y/Y Growth Rate</SelectItem>
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
                  <SelectTrigger data-testid="lag-periods">
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
                  data-testid="manual-correlate-button"
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
          {(inputData && tabValue === 'Manual' && (
            <InputData data={generateTabularData()} tab={tabValue} />
          )) ||
            (revenueData && tabValue === 'Automatic' && (
              <InputData data={revenueData} tab={tabValue} />
            ))}
        </div>
        <div className="w-min">
          {hasData && (
            <Results data={correlateResponseData} lagPeriods={lagPeriods} />
          )}
        </div>
      </div>
    </main>
  );
};

export default HomePage;
