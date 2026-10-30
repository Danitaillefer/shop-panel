import { PERIOD_OPTIONS } from "../lib/config";

interface PeriodSelectorProps {
    value: number;
    onChange: (days: number) => void;
}

export function PeriodSelector({value, onChange}: PeriodSelectorProps){

    return(
    <div className="control flex items-center gap-1 p-1">
        {PERIOD_OPTIONS.map(({label, days}) =>(
            <button key={label} onClick={() => onChange(days)} className= {`rounded-full px-3 py-1.5 text-muted ${value === days ? 'bg-foreground text-surface': ''}`}>{label}</button>
        ))}
        
    </div>
    )
}

