'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const inputFieldsSchema = z.object({
  name: z.string().min(1).max(255),
  email: z.string().min(1).max(255),
  message: z.string(),
});

const ContactPage = () => {
  const form = useForm<z.infer<typeof inputFieldsSchema>>({
    resolver: zodResolver(inputFieldsSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
  });
  const onSubmit = (values: z.infer<typeof inputFieldsSchema>) => {
    console.log(values);
  };

  return (
    <div>
      <Card className="mx-auto max-w-sm mt-16">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Contact Us
          </CardTitle>
          <CardDescription className="text-center">
            Explore the feature with us. Feel free to get in touch.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              noValidate
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Full Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Email address"
                        type="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message</FormLabel>
                    <FormControl>
                      <Input placeholder="How can we get better?" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-center">
                <Button
                  type="submit"
                  className="mx-8 bg-blue-800 my-1 text-white"
                >
                  Send Message
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContactPage;
