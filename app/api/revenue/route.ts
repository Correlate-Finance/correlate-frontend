import { type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const stock = searchParams.get('stock')
  const res = await fetch(`https://discountingcashflows.com/api/income-statement/${stock}/`)
  const json = await res.json()

  const revenues = new Map<string, number>();

  const report = json.report
  for (let i = 0; i < report.length; i++) {
    const date = report[i]["calendarYear"]
    revenues.set(date,report[i]["revenue"])
  }

  console.log(Object.fromEntries(revenues));
  return Response.json(Object.fromEntries(revenues))
}