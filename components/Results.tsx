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
    data: CorrelationDataPoint[]
}

export type CorrelationDataPoint = {
    title: string;
    pearson_value: number;
    lag: number;
}

const Results: React.FC<MyComponentProps> = ({ data }) => {

    const getColorClass = (value: number) => {
        if (Math.abs(value) > 0.8) {
            return 'text-green-400'; // Bright green
        } else if (Math.abs(value) < 0.2) {
            return 'text-red-200'; // Red
        } else {
            return 'text-white'; // Default color or any other color you prefer
        }
    };

    return (
        <>
            <h2 className="text-white text-center">Correlations</h2>
            <div className='text-white border-white'>
                <Table>
                    <TableCaption>Top Correlations with the data.</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">Table Name</TableHead>
                            <TableHead>Lag</TableHead>
                            <TableHead>Correlation</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((dp) => (
                            <TableRow key={dp.title}>
                                <TableCell className="font-medium">{dp.title}</TableCell>
                                <TableCell>{dp.lag}</TableCell>
                                <TableCell className={`${getColorClass(dp.pearson_value)}`}>{dp.pearson_value}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </>
    )
}

export default Results
