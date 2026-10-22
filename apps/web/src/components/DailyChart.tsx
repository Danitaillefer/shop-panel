import type { DailyPoint } from "../lib/metrics";
import {  Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { currencyFormatter, dateFormatter, shortDateFormatter } from "../lib/formatters";


export interface DailyChartProps{
    data: DailyPoint[]
}

export function DailyChart({data}: DailyChartProps){

    return (
        <div className="rounded-xl bg-white p-5 shadow-md">
            <h2 className="mb-4 text-sm font-medium text-gray-500">Facturación y beneficio</h2>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                    <XAxis dataKey="date" tickFormatter={(date) => shortDateFormatter.format(new Date(String(date)))} />
                    <YAxis />
                    <Line dataKey="revenue" name="Facturación" stroke="#2563eb" />
                    <Line dataKey="profit" name="Beneficio" stroke="#16a34a" />
                    <Tooltip 
                        formatter={ (value) => currencyFormatter.format(Number(value))}
                        labelFormatter={ (date) => dateFormatter.format(new Date(String(date)))}
                    />
                    <Legend />
                </LineChart>
            </ResponsiveContainer>
        </div>
    )

}