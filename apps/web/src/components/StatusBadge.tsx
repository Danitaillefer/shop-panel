import type { StatusTone } from "../lib/labels";

interface StatusBadgeProps {
    label: string;
    tone: StatusTone;
}

const TONE_CLASSES: Record<StatusTone, string> = {
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    neutral: 'bg-blue-100 text-blue-800'
}

function StatusBadge({label, tone}: StatusBadgeProps){
    return(
        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${TONE_CLASSES[tone]}`}>
            {label}
        </span>
    )
}

export default StatusBadge