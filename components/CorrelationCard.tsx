'use client';

import { getCompanySegments } from '@/app/api/actions';
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
import { inputFieldsSchema } from '@/hooks/usePage';
import { ReloadIcon } from '@radix-ui/react-icons';
import DOMPurify from 'isomorphic-dompurify';
import React, { useEffect, useState } from 'react';
import { z } from 'zod';

interface ComponentProps {
  onAutomaticSubmit: (inputFields: z.infer<typeof inputFieldsSchema>) => void;
  loadingAutomatic: boolean;
  onManualSubmit: (inputFields: z.infer<typeof inputFieldsSchema>) => void;
  loadingManual: boolean;
  setLagPeriods: (lagPeriods: number) => void;
}

const CorrelationCard: React.FC<ComponentProps> = ({
  onAutomaticSubmit,
  loadingAutomatic,
  onManualSubmit,
  loadingManual,
  setLagPeriods,
}) => {
  const [tabValue, setTabValue] = useLocalStorage('tabValue', 'Manual');
  const [segments, setSegments] = useState([] as string[]);
  const [inputFields, setInputFields] = useLocalStorage<
    z.infer<typeof inputFieldsSchema>
  >('inputFields', {
    ticker: 'AAPL',
    inputData: '',
    fiscalYearEnd: 'December',
    startYear: 2010,
    endYear: 2024,
    aggregationPeriod: 'Quarterly',
    correlationMetric: 'RAW_VALUE',
    lagPeriods: 0,
    highLevelOnly: true,
    segment: 'Total Revenue',
  });

  useEffect(() => {
    setLagPeriods(inputFields.lagPeriods);
  }, [inputFields.lagPeriods]);

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

  useEffect(() => {
    const fetchSegments = async () => {
      const data = await getCompanySegments(inputFields);
      const segments = data.map((x: any) => x.segment);
      setSegments(['Total Revenue'].concat(segments));
    };

    fetchSegments();
  }, [inputFields]);

  return (
    <Card className="dark:bg-[#1b1b26] bg-gray-100 m-4 min-w-[300px] border-0 sticky top-4">
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
            className="flex flex-col md:flex-col [&>*]:whitespace-nowrap [&>*]:mt-3 [&>*]:mx-4"
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
              <p className="text-sm text-opacity-80">Company Metric</p>
              <Select
                onValueChange={(e: string) =>
                  setInputFields({ ...inputFields, segment: e })
                }
                defaultValue={inputFields.segment?.toString()}
              >
                <SelectTrigger data-testid="segment">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {segments.map((segment) => (
                    <SelectItem value={segment} key={segment}>
                      {segment}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
            <div>
              <p className="text-sm text-opacity-80">End Year</p>
              <Input
                placeholder="2024"
                onChange={(e) => {
                  setInputFields({
                    ...inputFields,
                    endYear: Number(e.target.value),
                  });
                }}
                defaultValue={inputFields.endYear?.toString()}
                data-testid="automatic-start-year"
              />
            </div>
            <SharedInputFieldsHomePage
              inputFields={inputFields}
              setInputFields={setInputFields}
              setLagPeriods={setLagPeriods}
            />
            <Button
              className="mt-6 bg-[#517AF3] hover:bg-[#3e5cb8] text-white float-right"
              onClick={() => onAutomaticSubmit(inputFields)}
              data-testid="automatic-correlate-button"
            >
              {loadingAutomatic && (
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin " />
              )}
              Correlate
            </Button>
          </TabsContent>
          <TabsContent
            value="Manual"
            className="flex flex-col md:flex-col justify-around [&>*]:whitespace-nowrap [&>*]:mt-4 [&>*]:mx-4"
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
              setLagPeriods={setLagPeriods}
            />
            <Button
              onClick={() => onManualSubmit(inputFields)}
              className="bg-[#517AF3] hover:bg-[#3e5cb8] text-white float-right"
              data-testid="manual-correlate-button"
            >
              {loadingManual && (
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin " />
              )}
              Correlate
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CorrelationCard;
