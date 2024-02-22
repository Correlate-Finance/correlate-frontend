import { correlateIndex } from '@/app/api/actions';
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
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { CorrelationData, CorrelationDataPoint } from './Results';
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
      indexName: z.string().optional(),
      percentages: z
        .array(z.string().default((1 / checkedRows.size).toFixed(2)))
        .min(checkedRows.size),
    })
    .refine(
      (data) => {
        const sum = data.percentages.reduce((acc, curr) => {
          return acc + Number(curr);
        }, 0);
        return sum >= 0.99 && sum <= 1.0;
      },
      {
        message: 'The sum should be 1',
        path: [`percentages.${checkedRows.size - 1}`],
      },
    );

  const form = useForm<z.infer<typeof correlateIndexFormSchema>>({
    resolver: zodResolver(correlateIndexFormSchema),
    defaultValues: {
      indexName: '',
      percentages: Array.from({ length: checkedRows.size }, () =>
        (1 / checkedRows.size).toFixed(2),
      ),
    },
  });

  const onSubmit = async (values: z.infer<typeof correlateIndexFormSchema>) => {
    try {
      const result = await correlateIndex(values, data, checkedRows);
      setCorrelationDataPoint(result.data[0]);
    } catch (e) {
      toast({
        title: 'Error fetching correlation data',
        description: `${e}`,
      });
    }
  };

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            className="bg-blue-800 text-white"
            disabled={checkedRows.size === 0}
          >
            Create Index
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <DialogTitle>
                  {/* Leaving this in because we will be adding this very soon.
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
                  /> */}
                  <p>Create Correlation Index</p>
                  <Separator className="mt-2 dark:bg-white" />
                </DialogTitle>

                <ul>
                  {[...checkedRows].map((index, i) => (
                    <li key={index}>
                      <div className="flex flex-row justify-between m-1">
                        <div className="flex flex-col  w-4/5">
                          <p className="text-sm truncate ...">
                            {data.data[index].title}
                          </p>
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
                                  <Input
                                    placeholder="Percentage"
                                    defaultValue={(
                                      1 / checkedRows.size
                                    ).toFixed(2)}
                                    {...field}
                                  />
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
                <Separator className="mt-2 dark:bg-white" />
                <div className="flex justify-center">
                  <Button className="bg-blue-800 text-white my-2" type="submit">
                    Correlate
                  </Button>
                </div>
              </form>
            </Form>
          </DialogHeader>
          <DialogFooter>
            {correlationDataPoint && (
              <div className="w-full flex-col items-center justify-center">
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
    </div>
  );
}
