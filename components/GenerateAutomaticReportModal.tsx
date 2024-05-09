import { generateAutomaticReport } from '@/app/api/actions';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from '@/components/ui/dialog';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from './ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from './ui/form';
import { Input } from './ui/input';
import { Separator } from './ui/separator';
import { toast } from './ui/use-toast';

export default function GenerateAutomaticReportModal() {
  const [open, setOpen] = useState(false);
  const formSchema = z.object({
    stocks: z.string(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setOpen(false);
    const stocksArray = values.stocks.split(',').map((stock) => stock.trim());
    toast({
      title: 'Generating Report',
      description: `The report is being generated for  ${stocksArray.join(', ')}`,
    });
    generateAutomaticReport(stocksArray);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="bg-[#517AF3] hover:bg-[#3e5cb8] text-white float-right"
          data-testid="manual-correlate-button"
        >
          Generate New Report
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <p>Generate Automatic Reports</p>
              <Separator className="mt-4 mb-6 dark:bg-white" />
              <FormField
                control={form.control}
                name="stocks"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Comma separated tickers" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-center">
                <Button
                  className="bg-blue-800 text-white my-2 mx-2"
                  type="submit"
                >
                  Generate Reports
                </Button>
              </div>
            </form>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
