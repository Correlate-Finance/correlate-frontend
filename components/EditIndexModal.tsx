import { saveIndex } from '@/app/api/actions';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { CorrelationData } from './Results';
import { Button } from './ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from './ui/form';
import { Input } from './ui/input';
import { Separator } from './ui/separator';
import { useToast } from './ui/use-toast';

import { SquarePen } from 'lucide-react';

export default function EditIndexModal({ data }: { data: CorrelationData }) {
  if (!data) {
    data = {
      data: [],
      aggregationPeriod: '',
      correlationMetric: '',
    };
  }
  const { toast } = useToast();

  const correlateIndexFormSchema = z
    .object({
      indexName: z.string(),
      percentages: z
        .array(z.string().default((1 / data.data.length).toFixed(2)))
        .min(data.data.length),
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
        path: [`percentages.${data.data.length - 1}`],
      },
    )
    .refine(
      (data) => {
        return data.indexName.trim().length > 0;
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
      percentages: Array.from({ length: data.data.length }, () =>
        (1 / data.data.length).toFixed(2),
      ),
    },
  });

  const onSubmit = async (values: z.infer<typeof correlateIndexFormSchema>) => {
    try {
      await onSaveIndex(values);
    } catch (e) {
      toast({
        title: 'Error updating correlation data',
        description: `${e}`,
      });
    }
  };

  const onSaveIndex = async (
    values: z.infer<typeof correlateIndexFormSchema>,
  ) => {
    try {
      const percentages = values.percentages.map((p) => Number(p));
      const correlationData: CorrelationData = {
        data: Array(data.data.length).map((i) => data.data[i]),
        aggregationPeriod: data.aggregationPeriod,
        correlationMetric: data.correlationMetric,
      };

      await saveIndex(correlationData, values.indexName, percentages);
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
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <SquarePen size={20} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <p>Edit Correlation Index</p>
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

              <ul>
                {Array(data.data.length).map((index, i) => (
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
                    {i != data.data.length - 1 && (
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
                >
                  Save Index
                </Button>
              </div>
            </form>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
