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

export default function IndexModal({
  data,
  checkedRows,
}: {
  data: CorrelationData;
  checkedRows: Set<number>;
}) {
  const correlateIndexFormSchema = z
    .object({
      indexName: z.string().min(1),
      percentages: z
        .array(z.string().default((1 / checkedRows.size).toFixed(2)))
        .min(checkedRows.size),
    })
    .refine(
      (data) => {
        const sum = data.percentages.reduce((acc, curr) => {
          return acc + Number(curr);
        }, 0);
        return sum > 0.99 && sum <= 1.0;
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

  const onSubmit = (values: z.infer<typeof correlateIndexFormSchema>) => {};

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="bg-blue-800 text-white">Create Index</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader className="w-full">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
                <DialogTitle>
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
                  <Separator className="mt-2 bg-white" />
                </DialogTitle>

                <ul className="text-white w-full">
                  {[...checkedRows].map((index, i) => (
                    <li key={index}>
                      <div className="flex flex-row justify-between m-1 w-full">
                        <div className="flex flex-col w-4/5">
                          <p className="text-sm truncate ... whitespace-nowrap">
                            {data.data[index].title}
                          </p>
                          <p className="text-sm text-gray-500 ">
                            Correlation:{' '}
                            {data.data[index].pearson_value.toFixed(3)}
                          </p>
                        </div>
                        <div className="w-1/5">
                          <FormField
                            control={form.control}
                            name={`percentages.${i}`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input
                                    placeholder="Percentage"
                                    className="w-full"
                                    defaultValue={(
                                      1 / checkedRows.size
                                    ).toFixed(2)}
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage className="w-full" />
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

                <Separator className="mt-2 bg-white" />

                <div className="flex justify-center">
                  <Button className="bg-blue-800 text-white my-2" type="submit">
                    Correlate
                  </Button>
                </div>
              </form>
            </Form>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
