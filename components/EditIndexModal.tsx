import { saveIndex } from '@/app/api/actions';
import { IndexDataset, IndexDatasetType } from '@/app/api/schema';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { zodResolver } from '@hookform/resolvers/zod';
import { Pencil } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from './ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from './ui/form';
import { Input } from './ui/input';
import { Separator } from './ui/separator';
import { useToast } from './ui/use-toast';

export default function EditIndexModal({
  data,
  name,
  index_id,
}: {
  data: IndexDatasetType[];
  name: string;
  index_id: number;
}) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const correlateIndexFormSchema = z
    .object({
      indexName: z.string(),
      percentages: z.array(z.string()).min(data.length),
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
        path: [`percentages.${data.length - 1}`],
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
      indexName: name,
      percentages: data.map((dp) => dp.weight.toString()),
    },
  });

  const onSubmit = async (values: z.infer<typeof correlateIndexFormSchema>) => {
    try {
      await onSaveIndex(values, index_id);
    } catch (e) {
      toast({
        title: 'Error updating correlation data',
        description: `${e}`,
      });
    }
  };

  const onSaveIndex = async (
    values: z.infer<typeof correlateIndexFormSchema>,
    index_id: number,
  ) => {
    try {
      const indexDatasets: IndexDataset[] = data.map((dp, i) => {
        return {
          title: dp.dataset.external_name,
          percentage: values.percentages[i],
        };
      });
      await saveIndex(indexDatasets, values.indexName, index_id);
      toast({
        title: 'Index saved',
        description: `Index ${values.indexName} has been saved`,
      });
      setOpen(false);
    } catch (e) {
      toast({
        title: 'Error saving index',
        description: `${e}`,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <Pencil size={20} />
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

              <ul className="overflow-scroll max-h-[40vh]">
                {data.map((indexDataset, i) => (
                  <li key={i}>
                    <div className="flex flex-row justify-between m-1">
                      <div className="flex flex-col w-4/5">
                        <p className="text-sm">
                          {indexDataset.dataset.external_name}
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
                    {i != data.length - 1 && <Separator className="mt-2" />}
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
