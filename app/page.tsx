'use client';

import InputData from '@/components/InputData';
import Results from '@/components/Results';
import SharedInputFieldsHomePage from '@/components/SharedInputFieldsHomePage';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import {
  inputFieldsSchema,
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
  const [inputFields, setInputFields] = useLocalStorage<
    z.infer<typeof inputFieldsSchema>
  >('inputFields', {
    ticker: 'AAPL',
    inputData: '',
    fiscalYearEnd: 'December',
    startYear: 2010,
    aggregationPeriod: 'Quarterly',
    correlationMetric: 'RAW_VALUE',
    lagPeriods: 0,
    highLevelOnly: true,
  });

  const { correlateResponseData, setCorrelateResponseData } =
    useCorrelateResponseData();
  const { onSubmit, loading, hasData, revenueData } = useSubmitForm(
    setCorrelateResponseData,
  );
  const { correlateInputText, loading: loadingCorrelate } =
    useCorrelateInputText(setCorrelateResponseData);

  async function updateInputText(e: React.ChangeEvent<HTMLTextAreaElement>) {
    e.preventDefault();
    setInputFields({
      ...inputFields,
      inputData: e.target.value,
    });
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

    setInputFields({
      ...inputFields,
      inputData: table.map((row) => row.join('\t')).join('\n'),
    });
  }

  function generateTabularData() {
    let rows = inputFields.inputData?.split('\n');
    let table: string[][] = [];

    rows?.forEach((row) => {
      table.push(row.split('\t'));
    });
    // Transpose table
    if (table.length == 2) {
      table = table[0].map((_, colIndex) => table.map((row) => row[colIndex]));
    }
    return table;
  }

  return (
    <div className="flex overflow-scroll max-h-[90vh]">
      <Card className="dark:bg-[#1b1b26] bg-gray-100 m-4 w-[300px] border-0 sticky top-4">
        <CardContent className="px-4">
          <Tabs
            value={tabValue}
            className="my-4"
            onValueChange={(e) => setTabValue(e)}
          >
            <TabsList className="flex flex-row m-auto bg-inherit justify-around w-full">
              <TabsTrigger value="Manual" className="flex-1">
                Manual
              </TabsTrigger>
              <TabsTrigger value="Automatic" className="flex-1">
                Automatic
              </TabsTrigger>
            </TabsList>
            <TabsContent
              value="Automatic"
              className="flex flex-col md:flex-col [&>*]:whitespace-nowrap [&>*]:mt-4 [&>*]:mx-8"
            >
              <div>
                <p className="text-sm text-opacity-80">Ticker</p>
                <Input
                  placeholder="AAPL"
                  onChange={(e) => {
                    setInputFields({
                      ...inputFields,
                      ticker: e.target.value,
                    });
                  }}
                  defaultValue={inputFields.ticker}
                  data-testid="automatic-ticker"
                />
              </div>
              <div>
                <p className="text-sm text-opacity-80">Start Year</p>
                <Input
                  placeholder="2010"
                  onChange={(e) => {
                    setInputFields({
                      ...inputFields,
                      startYear: Number(e.target.value),
                    });
                  }}
                  defaultValue={inputFields.startYear.toString()}
                  data-testid="automatic-start-year"
                />
              </div>
              <SharedInputFieldsHomePage
                inputFields={inputFields}
                setInputFields={setInputFields}
              />
              <Button
                className="mt-6 bg-green-600 hover:bg-green-900 float-right"
                onClick={() => onSubmit(inputFields)}
                data-testid="automatic-correlate-button"
              >
                {loading && (
                  <ReloadIcon className="mr-2 h-4 w-4 animate-spin " />
                )}
                Correlate
              </Button>
            </TabsContent>
            <TabsContent
              value="Manual"
              className="flex flex-col md:flex-col justify-around [&>*]:whitespace-nowrap [&>*]:mt-4"
            >
              <div className="">
                <p className="text-sm text-opacity-80">Input Data</p>
                <Textarea
                  onChange={updateInputText}
                  onPaste={handlePaste}
                  placeholder="Paste excel data here"
                  className=""
                  value={inputFields.inputData}
                />
              </div>
              <div>
                <p className="text-sm mt-2 text-opacity-80">Fiscal Year End</p>
                <Select
                  onValueChange={(e: string) =>
                    setInputFields({ ...inputFields, fiscalYearEnd: e })
                  }
                  defaultValue={inputFields.fiscalYearEnd}
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
              <SharedInputFieldsHomePage
                inputFields={inputFields}
                setInputFields={setInputFields}
              />
              <Button
                onClick={() => correlateInputText(inputFields)}
                className="bg-green-600 hover:bg-green-900 float-right"
                data-testid="manual-correlate-button"
              >
                {loadingCorrelate && (
                  <ReloadIcon className="mr-2 h-4 w-4 animate-spin " />
                )}
                Correlate
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      {/* <Separator orientation="vertical" className="my-40 w-4 border-white" /> */}
      <div className="m-5 flex flex-row justify-between w-3/4 gap-8">
        <div className="w-min">
          {(inputFields.inputData && tabValue === 'Manual' && (
            <InputData data={generateTabularData()} tab={tabValue} />
          )) ||
            (revenueData && tabValue === 'Automatic' && (
              <InputData data={revenueData} tab={tabValue} />
            ))}
        </div>
        <div className="flex-1">
          {hasData && (
            <Results
              data={correlateResponseData}
              lagPeriods={inputFields.lagPeriods}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
