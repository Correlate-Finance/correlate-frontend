"use client"

import { ReloadIcon } from "@radix-ui/react-icons"

import { Button } from '@/components/ui/button'
import { Textarea } from "@/components/ui/textarea"
import React, { FormEvent } from 'react'
import { useState, useEffect } from 'react'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { SubmitHandler, useForm } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import Results, {CorrelationDataPoint} from "@/components/Results"



const Page = () => {
  const [isLoading, setLoading] = useState(false);
  const [hasData, setHasData] = useState(false);
  const [data, setDataArray] = useState<CorrelationDataPoint[]>([]);
  console.log(hasData, data)

  const formSchema = z.object({
    ticker: z.string().min(2, {
      message: "Stock Ticker must be at least 2 characters.",
    }),
    startYear: z.number().max(2023, { message: "Year needs to be lower than 2023" }).min(2000, { message: "Year needs to be higher than 2000" })
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true)

    const res = await fetch(`api/fetch?stock=${values.ticker}`);
    const jsonData = await res.json()

    
    setLoading(false)
    
    const arrData = jsonData.data.data as CorrelationDataPoint[]
    
    setDataArray(arrData)
    setHasData(true)
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ticker: "AAPL",
      startYear: 2018,
    },
  })

  return (
    <main className='flex flex-row h-full w-full justify-center' >
      <div className="w-40 ml-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-1">
            <FormField
              control={form.control}
              name="ticker"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ticker</FormLabel>
                  <FormControl>
                    <Input placeholder="AAPL" {...field} />
                  </FormControl>
                  <FormDescription>
                    Stock Display Name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="startYear"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Year</FormLabel>
                  <FormControl>
                    <Input placeholder="2018" {...field} />
                  </FormControl>
                  <FormDescription>
                    The year to correlate from.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit"> {isLoading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin " />} Correlate</Button>
          </form>
        </Form>
      </div>
      {/* <Separator orientation="vertical" className="my-40 w-4 border-white" /> */}
      <div className="w-1/2 m-5">
        {hasData && <Results data={data}/>}
      </div>
    </main>
  )
}

export default Page