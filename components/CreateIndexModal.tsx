import { DatasetMetadata } from '@/app/api/schema';
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
import { Button } from './ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from './ui/form';
import { Input } from './ui/input';
import { Separator } from './ui/separator';

export default function CreateIndexModal({
  data,
}: {
  data: DatasetMetadata[];
}) {
  const totalRows = data.length;
  const correlateIndexFormSchema = z
    .object({
      indexName: z.string(),
      percentages: z.array(z.string()).min(totalRows),
    })
    .refine(
      (values) => {
        const sum = values.percentages.reduce((acc, curr) => {
          return acc + Number(curr);
        }, 0);
        return sum >= 0.99 && sum <= 1.0;
      },
      {
        message: 'The sum should be 1',
        path: [`percentages.${totalRows - 1}`],
      },
    )
    .refine(
      (values) => {
        values.indexName.trim().length > 0;
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
      percentages: Array.from({ length: totalRows }, () =>
        (1 / totalRows).toFixed(2),
      ),
    },
  });

  const createIndex = async (
    values: z.infer<typeof correlateIndexFormSchema>,
  ) => {
    await onSaveIndex(values);
    return;
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="bg-blue-800 text-white"
          disabled={totalRows > 5}
          onClick={() => {
            form.setValue(
              'percentages',
              Array.from({ length: totalRows }, () =>
                (1 / totalRows).toFixed(2),
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
            <form onSubmit={form.handleSubmit(createIndex)}>
              <DialogTitle>
                <div className="flex flex-row items-center">
                  <FormField
                    control={form.control}
                    name="indexName"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="Index Name"
                            className="w-2/3"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <p>Create Correlation Index</p>
                </div>
                <Separator className="mt-2 dark:bg-white" />
              </DialogTitle>

              <ul>
                {[...data].map((dp, i) => (
                  <li key={dp.series_id}>
                    <div className="flex flex-row justify-between m-1">
                      <p className="text-sm">{dp.title}</p>
                      <div className="w-1/5 shrink-0">
                        <FormField
                          control={form.control}
                          name={`percentages.${i}`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  placeholder="Percentage"
                                  defaultValue={(1 / totalRows).toFixed(2)}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    {i != totalRows - 1 && <Separator className="mt-2" />}
                  </li>
                ))}
              </ul>
              <Separator className="mt-2 dark:bg-white" />
              <div className="flex justify-center">
                <Button className="bg-blue-800 text-white my-2" type="submit">
                  Save
                </Button>
              </div>
            </form>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
function onSaveIndex(values: { indexName: string; percentages: string[] }) {
  throw new Error('Function not implemented.');
}
