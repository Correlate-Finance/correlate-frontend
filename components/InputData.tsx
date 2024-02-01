import React from 'react'

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"


interface MyComponentProps {
    data: (string|number)[][]
}


const InputData: React.FC<MyComponentProps> = ({ data }) => {

    let USDollar = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    });

    return (
        <div className='text-white border-white'>
            <Table>
                <TableCaption>Input Data.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">Date</TableHead>
                        <TableHead>Value</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((dp) => (
                        <TableRow key={dp[0]}>
                            <TableCell className="font-medium w-1/2">{dp[0]}</TableCell>
                            <TableCell>{USDollar.format(dp[1] as number)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}

export default InputData