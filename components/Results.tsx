import React from 'react'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"


interface MyComponentProps {
    data: CorrelationDataPoint[]
}

export type CorrelationDataPoint = {
    title: string;
    pearson_value: number;
}

const Results: React.FC<MyComponentProps> = ({ data }) => {
    console.log("rendering results")
    console.log(data)

    return (
        <div className='text-white border-white'>
            <Table>
                <TableCaption>Top Correlations with the data.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">Table Name</TableHead>
                        <TableHead>Correlation</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((dp) => (
                        <TableRow key={dp.title}>
                            <TableCell className="font-medium">{dp.title}</TableCell>
                            <TableCell>{dp.pearson_value}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}

export default Results
