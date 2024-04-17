import { saveIndex } from '@/app/api/actions';
import { DatasetMetadata, IndexDataset } from '@/app/api/schema';
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
import { useToast } from './ui/use-toast';

export default function CreateIndexModal({
  data,
}: {
  data: DatasetMetadata[];
}) {
  const totalRows = data.length;
  const { toast } = useToast();
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

  const onSaveIndex = async (
    values: z.infer<typeof correlateIndexFormSchema>,
  ) => {
    try {
      const indexDatasets: IndexDataset[] = data.map((metadata, i) => {
        return {
          title: metadata.external_name,
          percentage: values.percentages[i],
        };
      });
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
  };

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
                  <li key={dp.internal_name}>
                    <div className="flex flex-row justify-between m-1">
                      <p className="text-sm">{dp.external_name}</p>
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
