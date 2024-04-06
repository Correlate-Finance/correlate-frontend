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

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp';

import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { sendOTP, verifyOTP } from '@/app/api/actions';

const inputFieldsSchema = z.object({
  email: z.string().min(1).max(255),
});

const ResetPassword = () => {
  const emailSubmitted = useRef(false);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const otpVerified = useRef(false);
  const searchParams = useSearchParams();

  // Check if the query object has a specific parameter
  const hasError = searchParams.get('error') !== null;
  const errorMessage =
    'Invalid Email. Check the details you provided are correct.';
  const form = useForm<z.infer<typeof inputFieldsSchema>>({
    resolver: zodResolver(inputFieldsSchema),
    defaultValues: {
      email: '',
    },
  });

  async function onEmailSubmit(values: z.infer<typeof inputFieldsSchema>) {
    emailSubmitted.current = true;
    setEmail(values.email);
    sendOTP(values.email);
  }

  function onOTPSubmit() {
    const response = verifyOTP(email, otp);
    response.then((res) => {
      if (res === 'OTP is correct') {
        otpVerified.current = true;
      }
    });
  }

  return (
    <Card className="mx-auto max-w-sm mt-16">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">
          Reset your password
        </CardTitle>
        <CardDescription>
          {emailSubmitted
            ? 'Enter the OTP sent to your email address.'
            : 'Enter your email address to receive an OTP.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {hasError && (
          <div>
            <p className="bg-red-800 p-1">{errorMessage}</p>
          </div>
        )}

        {!emailSubmitted ? (
          <Form {...form}>
            <form
              noValidate
              onSubmit={form.handleSubmit(onEmailSubmit)}
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
              <div className="flex justify-center">
                <Button type="submit">Submit</Button>
              </div>
            </form>
          </Form>
        ) : (
          <form onSubmit={() => {}} className="space-y-4">
            <div className="flex justify-center mb-8">
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={(value) => {
                  setOtp(value);
                }}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
            <div className="flex justify-center">
              <Button type="submit" onClick={onOTPSubmit}>
                Enter
              </Button>
            </div>
          </form>
        )}
      </CardContent>
      <CardFooter className="text-sm flex flex-col justify-center">
        <div className="text-neutral-400 ">
          New user?{' '}
          <Link href="/register" className="text-blue-400">
            Sign Up
          </Link>
        </div>
        <div className="mt-2 text-neutral-400 ">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-400">
            Login
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
};
export default ResetPassword;
