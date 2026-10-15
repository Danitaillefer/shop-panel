type KpiFormat = 'currency' | 'percent'

interface KpiCardProps {
    title: string;
    value: number;
    change: number;
    format?: KpiFormat;
}

export function KpiCard({title, value, change, format = 'currency'}: KpiCardProps){
    const isPositive = change >= 0
    const formattedValue = new Intl.NumberFormat('es-ES', {
        style:format,
        currency: 'EUR',
        maximumFractionDigits: format == 'percent' ? 1 : 0
    }).format(value)
    return (    
        <div className="flex flex-col items-center shadow-md rounded-xl p-5 gap-2 bg-white">
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <span className="text-4xl font-bold">{formattedValue}</span>
            <span className={`text-xs ${isPositive ? 'text-green-600' : 'text-red-600'}`}>{isPositive ? '+':''}{change}% vs mes anterior</span>
        </div>
    )
}