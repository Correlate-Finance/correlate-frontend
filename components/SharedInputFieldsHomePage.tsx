import { inputFieldsSchema } from '@/hooks/usePage';
import { z } from 'zod';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import React from 'react';

export default function SharedInputFieldsHomePage({
  inputFields,
  setInputFields,
}: {
  inputFields: z.infer<typeof inputFieldsSchema>;
  setInputFields: (inputFields: z.infer<typeof inputFieldsSchema>) => void;
}) {
  return (
    <React.Fragment>
      <div>
        <p className="dark:text-white text-sm mb-2 text-opacity-80">
          Aggregation Period
        </p>
        <Select
          defaultValue={inputFields.aggregationPeriod}
          onValueChange={(e: string) => {
            setInputFields({
              ...inputFields,
              aggregationPeriod: e,
            });
          }}
        >
          <SelectTrigger data-testid="aggregation-period">
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
          defaultValue={inputFields.correlationMetric}
          onValueChange={(e: string) => {
            setInputFields({
              ...inputFields,
              correlationMetric: e,
            });
          }}
        >
          <SelectTrigger data-testid="correlation-metric">
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
          defaultValue={inputFields.lagPeriods.toString()}
          onValueChange={(e: string) => {
            setInputFields({
              ...inputFields,
              lagPeriods: Number(e),
            });
          }}
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
          checked={inputFields.highLevelOnly}
          onCheckedChange={(e) => {
            setInputFields({
              ...inputFields,
              highLevelOnly: e,
            });
          }}
        />
      </div>
    </React.Fragment>
  );
}
