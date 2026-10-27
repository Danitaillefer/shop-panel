import { ArrowDownRight, ArrowUpRight } from "lucide-react";

type KpiFormat = 'currency' | 'percent' | 'decimal'
type ChangeFormat = 'percent' | 'pp';
type KpiVariant = 'featured' | 'small' | 'large'

interface KpiCardProps {
    title: string;
    value: number;
    change: number;
    format?: KpiFormat;
    changeFormat?: ChangeFormat;
    variant?: KpiVariant;
}

const VARIANT_STYLES : Record<KpiVariant,  {card: string, value: string}> = {
    featured: {card: 'bg-brand-gradient glass-card', value: 'text-6xl'},
    small: {card: 'glass-card', value: 'text-3xl'},
    large: {card: 'glass-card', value: 'text-6xl'},
}

export function KpiCard({title, value, change, format = 'currency', changeFormat = 'percent', variant = 'small'}: KpiCardProps){
    const isPositive = change >= 0
    const formattedValue = new Intl.NumberFormat('es-ES', {
        style:format,
        currency: 'EUR',
        useGrouping: 'always',
        maximumFractionDigits: format === 'percent' ? 1 : 0
    }).format(value).replaceAll('\u00A0', ' ')
    const formattedChangeNumber = new Intl.NumberFormat('es-ES', {
        maximumFractionDigits: changeFormat === 'percent' ? 0 : 1, 
        signDisplay: 'exceptZero'
    }).format(change);
    const formattedChange = `${formattedChangeNumber}${changeFormat === 'percent' ? '%' : ' pp'}`;
    const changeColor = variant === 'featured' ? '' : isPositive ? 'bg-positive/15 text-positive' : 'bg-negative/15 text-negative';
    return (    
        <div className={`flex flex-col justify-between gap-3 ${VARIANT_STYLES[variant].card} p-8 ${variant==='featured' ? 'relative overflow-hidden text-background': ''}`}>
            <p className={`text-sm  ${variant !== 'featured' ? 'text-muted': ''}`}>{title}</p>
            <span className={`${VARIANT_STYLES[variant].value} font-bold`}>{formattedValue}</span>
            {variant === 'featured' ? (
                <span className="text-sm font-medium">{formattedChange} vs periodo anterior</span>
            ): (
            <span
            className={`inline-flex items-center gap-0.5 self-start rounded-full px-2 py-0.5 text-xs font-semibold ${
                changeColor
                }`}
                >
            {isPositive ? (
                <ArrowUpRight className="size-3" aria-hidden="true" />
            ) : (
                <ArrowDownRight className="size-3" aria-hidden="true" />
            )}
            {formattedChange}
            </span>
            )}
        </div>
    )
}