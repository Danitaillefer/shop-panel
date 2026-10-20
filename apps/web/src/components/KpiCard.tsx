type KpiFormat = 'currency' | 'percent' | 'decimal'
type ChangeFormat = 'percent' | 'pp';

interface KpiCardProps {
    title: string;
    value: number;
    change: number;
    format?: KpiFormat;
    changeFormat?: ChangeFormat;
}

export function KpiCard({title, value, change, format = 'currency', changeFormat = 'percent'}: KpiCardProps){
    const isPositive = change >= 0
    const formattedValue = new Intl.NumberFormat('es-ES', {
        style:format,
        currency: 'EUR',
        useGrouping: 'always',
        maximumFractionDigits: format === 'percent' ? 1 : 0
    }).format(value)
    const formattedChangeNumber = new Intl.NumberFormat('es-ES', {
        maximumFractionDigits: changeFormat === 'percent' ? 0 : 1, 
        signDisplay: 'exceptZero'
    }).format(change);
    const formattedChange = `${formattedChangeNumber}${changeFormat === 'percent' ? '%' : ' pp'}`;
    return (    
        <div className="flex flex-col items-center shadow-md rounded-xl p-5 gap-2 bg-white">
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <span className="text-4xl font-bold">{formattedValue}</span>
            <span className={`text-xs ${isPositive ? 'text-green-600' : 'text-red-600'}`}>{formattedChange} vs periodo anterior</span>
        </div>
    )
}