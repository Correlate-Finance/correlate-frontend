'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const inputFieldsSchema = z.object({
  email: z.string().min(1).max(255),
  password: z.string().min(1).max(255),
});

const Login = () => {
  const searchParams = useSearchParams();

  // Check if the query object has a specific parameter
  const hasError = searchParams.get('error') !== null;
  const errorMessage =
    'Sign in failed. Check the details you provided are correct.';
  const form = useForm<z.infer<typeof inputFieldsSchema>>({
    resolver: zodResolver(inputFieldsSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof inputFieldsSchema>) {
    signIn('credentials', { ...values, callbackUrl: '/' });
  }

  return (
    <Card className="mx-auto max-w-sm mt-16">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Login</CardTitle>
        <CardDescription>
          Enter your email and password to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        {hasError && (
          <div>
            <p className="bg-red-800 p-1">{errorMessage}</p>
          </div>
        )}

        <Form {...form}>
          <form
            noValidate
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="example@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-center">
              <Button type="submit">Submit</Button>
            </div>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="text-sm flex flex-col justify-center">
        <div className="text-neutral-400 ">
          New user?{' '}
          <Link href="/register" className="text-blue-400">
            Sign Up
          </Link>
        </div>
        <div className="mt-2 text-neutral-400 ">
          Forgot your password?{' '}
          <Link href="/reset-password" className="text-blue-400">
            Reset your password
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
};
export default Login;
