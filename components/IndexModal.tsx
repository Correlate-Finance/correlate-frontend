import { correlateIndex, saveIndex } from '@/app/api/actions';
import {
  CorrelationData,
  CorrelationDataPoint,
  IndexDataset,
} from '@/app/api/schema';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { convertToGraphData } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import DoubleLineChart from './chart/DoubleLineChart';
import { Button } from './ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from './ui/form';
import { Input } from './ui/input';
import { Separator } from './ui/separator';
import { useToast } from './ui/use-toast';

export default function IndexModal({
  data,
  checkedRows,
}: {
  data: CorrelationData;
  checkedRows: Set<number>;
}) {
  const [correlationDataPoint, setCorrelationDataPoint] = useState<
    CorrelationDataPoint | undefined
  >();
  const { toast } = useToast();

  const correlateIndexFormSchema = z
    .object({
      indexName: z.string(),
      percentages: z
        .array(z.string().default((1 / checkedRows.size).toFixed(3)))
        .min(checkedRows.size),
      button: z.string(),
    })
    .refine(
      (values) => {
        const sum = values.percentages.reduce((acc, curr) => {
          return acc + Number(curr);
        }, 0);
        return sum >= 0.98 && sum <= 1.2;
      },
      {
        message: 'The sum should be 1',
        path: [`percentages.${checkedRows.size - 1}`],
      },
    )
    .refine(
      (data) => {
        return data.button === 'correlate'
          ? true
          : data.indexName.trim().length > 0;
      },
      {
        message: 'Index name is required',
        path: ['indexName'],
      },
    );

  const form = useForm<z.infer<typeof correlateIndexFormSchema>>({
    resolver: zodResolver(correlateIndexFormSchema),
    defaultValues: {
      indexName: '',
      percentages: Array.from({ length: checkedRows.size }, () =>
        (1 / checkedRows.size).toFixed(3),
      ),
      button: 'correlate',
    },
  });

  const onSubmit = async (values: z.infer<typeof correlateIndexFormSchema>) => {
    if (values.button === 'save') {
      await onSaveIndex(values);
      return;
    }

    try {
      const result = await correlateIndex(
        values,
        Array.from(checkedRows).map((i) => data.data[i].title),
        data.aggregationPeriod,
        data.correlationMetric,
        data.data[0].input_data,
        data.data[0].dates,
      );
      setCorrelationDataPoint(result.data[0]);
    } catch (e) {
      toast({
        title: 'Error fetching correlation data',
        description: `${e}`,
      });
    }
  };

  const onSaveIndex = useMemo(
    () => async (values: z.infer<typeof correlateIndexFormSchema>) => {
      try {
        const indexDatasets: IndexDataset[] = Array.from(checkedRows).map(
          (checkedIndex, i) => {
            return {
              title: data.data[checkedIndex].title,
              percentage: values.percentages[i],
            };
          },
        );
        await saveIndex(indexDatasets, values.indexName);
        toast({
          title: 'Index saved',
          description: `Index ${values.indexName} has been saved`,
        });
      } catch (e) {
        toast({
          title: 'Error saving index',
          description: `${e}`,
        });
      }
    },
    [checkedRows, data, toast],
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="bg-blue-800 text-white"
          disabled={checkedRows.size > 20}
          onClick={() => {
            form.setValue(
              'percentages',
              Array.from({ length: checkedRows.size }, () =>
                (1 / checkedRows.size).toFixed(3),
              ),
            );
          }}
        >
          Create Index
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <p>Create Correlation Index</p>
              <Separator className="mt-4 mb-6 dark:bg-white" />
              <DialogTitle className="mb-6">
                <FormField
                  control={form.control}
                  name="indexName"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Index Name"
                          className="w-1/3"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </DialogTitle>

              <ul className="overflow-scroll max-h-[40vh]">
                {[...checkedRows].map((index, i) => (
                  <li key={index}>
                    <div className="flex flex-row justify-between m-1">
                      <div className="flex flex-col w-4/5">
                        <p className="text-sm">{data.data[index].title}</p>
                        <p className="text-sm text-gray-500 ">
                          Correlation:{' '}
                          {data.data[index].pearson_value.toFixed(3)}
                        </p>
                      </div>
                      <div className="w-1/5 shrink-0">
                        <FormField
                          control={form.control}
                          name={`percentages.${i}`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input placeholder="Percentage" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    {i != checkedRows.size - 1 && (
                      <Separator className="mt-2" />
                    )}
                  </li>
                ))}
              </ul>
              <Separator className="mt-2 mb-4 dark:bg-white" />
              <div className="flex justify-center">
                <Button
                  className="bg-blue-800 text-white my-2 mx-2"
                  type="submit"
                  onClick={() => form.setValue('button', 'correlate')}
                >
                  Correlate
                </Button>
                <Button
                  className="bg-blue-800 text-white my-2 mx-2"
                  type="submit"
                  onClick={() => form.setValue('button', 'save')}
                >
                  Save Index
                </Button>
              </div>
            </form>
          </Form>
        </DialogHeader>
        <DialogFooter>
          {correlationDataPoint && (
            <div className="w-3/4 m-auto flex-col items-center justify-center">
              <p className="text-lg text-center">
                {`Correlation Value: ${correlationDataPoint.pearson_value.toFixed(3)}`}
              </p>
              <DoubleLineChart
                data={convertToGraphData(correlationDataPoint)}
              />
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
