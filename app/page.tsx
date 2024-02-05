"use client"

import { ReloadIcon } from "@radix-ui/react-icons"

import { Button } from '@/components/ui/button'
import { Textarea } from "@/components/ui/textarea"
import React, { FormEvent, useReducer } from 'react'
import { useState, useEffect } from 'react'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { SubmitHandler, useForm } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import Results, { CorrelationDataPoint } from "@/components/Results"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import InputData from "@/components/InputData"
import { RevenueResponseSchema } from "./api/schema"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


const Page = () => {
  const [isLoading, setLoading] = useState(false);
  const [hasData, setHasData] = useState(false);
  const [data, setDataArray] = useState<CorrelationDataPoint[]>([]);
  const [revenueData, setRevenueData] = useState<(string)[][]>();
  const [fiscalYearEnd, setFiscalYearEnd] = useState<string>("December");


  const [inputData, setInputData] = useState("");

  const formSchema = z.object({
    ticker: z.string().min(2, {
      message: "Stock Ticker must be at least 2 characters.",
    }),
    startYear: z.coerce.number().max(2023, { message: "Year needs to be lower than 2023" }).min(2000, { message: "Year needs to be higher than 2000" }),
    aggregationPeriod: z.string()
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    getRevenueData(values)
    setLoading(true)

    const res = await fetch(`api/fetch?stock=${values.ticker}&startYear=${values.startYear}&aggregationPeriod=${values.aggregationPeriod}`);
    const jsonData = await res.json()

    setLoading(false)
    const arrData = jsonData.data.data as CorrelationDataPoint[]
    setDataArray(arrData)
    setHasData(true)
  }

  async function getRevenueData(values: z.infer<typeof formSchema>) {
    setLoading(true)

    const res = await fetch(`api/revenue?stock=${values.ticker}&startYear=${values.startYear}&aggregationPeriod=${values.aggregationPeriod}`);
    const jsonData = await res.json()

    const parsed = RevenueResponseSchema.parse(jsonData.data);

    const parsedData = parsed.map(x => [x.date, x.value])
    setRevenueData(parsedData)
  }

  function updateInputText(e: React.ChangeEvent<HTMLTextAreaElement>) {
    e.preventDefault()
    setInputData(e.target.value)
  }

  async function correlateInputText() {
    setLoading(true)

    const res = await fetch(`api/correlateinputdata?fiscalYearEnd=${fiscalYearEnd}`, {
      method: "POST",
      body: inputData,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
      }
    });
    const jsonData = await res.json()

    setLoading(false)
    const arrData = jsonData.data.data as CorrelationDataPoint[]
    setDataArray(arrData)
    setHasData(true)
  }

  function generateTabularData() {
    var rows = inputData.split("\n");

    var table: (string)[][] = [];

    for (var y in rows) {
      var cells = rows[y].split("\t");
      table.push(cells);
    }

    // Transpose table
    if (table.length == 2) {
      table = table[0].map((_, colIndex) => table.map(row => row[colIndex]));
    }

    return table;
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ticker: "AAPL",
      startYear: 2010,
      aggregationPeriod: "Annually",
    },
  })

  return (
    <main className='flex flex-row h-full w-full justify-center' >
      <div className="m-4">
        <Tabs defaultValue="Manual" className="w-[400px]">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="Manual">Manual</TabsTrigger>
            <TabsTrigger value="Automatic">Automatic</TabsTrigger>
          </TabsList>
          <TabsContent value="Automatic">
            <div className="w-40 ml-4">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-1">
                  <FormField
                    control={form.control}
                    name="ticker"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Ticker</FormLabel>
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
                        <FormLabel className="text-white">Start Year</FormLabel>
                        <FormControl>
                          <Input placeholder="2010" {...field} />
                        </FormControl>
                        <FormDescription>
                          The year to correlate from.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="aggregationPeriod"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Aggregation Period</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue="Annually">
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Annually">Annually</SelectItem>
                            <SelectItem value="Quarterly">Quarterly</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Aggregation Period
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit"> {isLoading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin " />} Correlate</Button>
                </form>
              </Form>
            </div>
            {revenueData && <InputData data={revenueData} />}
          </TabsContent>
          <TabsContent value="Manual" className="flex flex-col justify-around m-4">
            <Textarea onChange={updateInputText} placeholder="Paste excel data here" className="mb-4"/>
            <p className="text-white"> Fiscal Year End</p>
            <Select onValueChange={(e: string) => setFiscalYearEnd(e)} defaultValue="December">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="January">January</SelectItem>
                <SelectItem value="February">February</SelectItem>
                <SelectItem value="March">March</SelectItem>
                <SelectItem value="April">April</SelectItem>
                <SelectItem value="May">May</SelectItem>
                <SelectItem value="June">June</SelectItem>
                <SelectItem value="July">July</SelectItem>
                <SelectItem value="August">August</SelectItem>
                <SelectItem value="September">September</SelectItem>
                <SelectItem value="October">October</SelectItem>
                <SelectItem value="November">November</SelectItem>
                <SelectItem value="December">December</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={correlateInputText} className="mt-4"> {isLoading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin " />} Correlate</Button>
            {inputData && <InputData data={generateTabularData()} />}
          </TabsContent>
        </Tabs>
      </div>

      {/* <Separator orientation="vertical" className="my-40 w-4 border-white" /> */}
      <div className="w-1/2 m-5">
        {hasData && <Results data={data} />}
      </div>
    </main>
  )
}

export default Page