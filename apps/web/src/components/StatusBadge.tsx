import type { StatusTone } from "../lib/labels";

interface StatusBadgeProps {
    label: string;
    tone: StatusTone;
}

const TONE_CLASSES: Record<StatusTone, string> = {
  success: 'bg-positive/15 text-positive',
  warning: 'bg-warning/15 text-warning',
  danger: 'bg-negative/15 text-negative',
  neutral: 'bg-info/15 text-info',
}

function StatusBadge({label, tone}: StatusBadgeProps){
    return(
        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${TONE_CLASSES[tone]}`}>
            {label}
        </span>
    )
}

export default StatusBadge