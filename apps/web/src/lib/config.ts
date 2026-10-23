export const ORDER_FIXED_FEE = 3;
export const DEMO_TODAY = new Date('2026-10-16T23:59:59Z');
export const MS_PER_DAY = 24 * 60 * 60 * 1000;
export const DELAYED_ORDER_DAYS = 3;
export const DEFAULT_PERIOD_DAYS = 14;

export interface PeriodOption {
    label: string;
    days: number;
}

export const PERIOD_OPTIONS: PeriodOption[] = [
    {label: "7D", days: 7},
    {label: "14D", days: 14},
    {label: "30D", days: 30},
    {label: "12M", days: 365}
]