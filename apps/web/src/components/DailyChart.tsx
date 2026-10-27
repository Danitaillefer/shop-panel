import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { DailyPoint } from '../lib/metrics'
import { currencyFormatter, longDateFormatter, shortDateFormatter } from '../lib/formatters'

interface DailyChartProps {
  data: DailyPoint[]
}

const SERIES = [
  { key: 'revenue', label: 'Facturación', color: 'var(--color-brand-blue)' },
  { key: 'profit', label: 'Beneficio', color: 'var(--color-brand-green)' },
] as const

export function DailyChart({ data }: DailyChartProps) {
  return (
    <div className="glass-card p-8">
      {/* Cabecera: título y leyenda */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-lg font-semibold tracking-tight">Facturación y beneficio</h2>
        <div className="flex gap-4 text-sm">
          {SERIES.map(({ key, label, color }) => (
            <span key={key} className="flex items-center gap-2">
              <span className="size-2.5 rounded-full" style={{ backgroundColor: color }} />
              {label}
            </span>
          ))}
        </div>
      </div>

      {/* Gráfica */}
      <div className="mt-6 h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              {SERIES.map(({ key, color }) => (
                <linearGradient key={key} id={`gradient-${key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity={0.45} />
                  <stop offset="100%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>

            <CartesianGrid vertical={false} stroke="var(--color-border)" />
            <XAxis
              dataKey="date"
              tickFormatter={(date) => shortDateFormatter.format(new Date(String(date)))}
              tick={{ fill: 'var(--color-muted)', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              width={40}
              tick={{ fill: 'var(--color-muted)', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              formatter={(value) => currencyFormatter.format(Number(value))}
              labelFormatter={(date) => longDateFormatter.format(new Date(String(date)))}
              contentStyle={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: 16,
              }}
            />

            {SERIES.map(({ key, label, color }) => (
              <Area
                key={key}
                type="monotone"
                dataKey={key}
                name={label}
                stroke={color}
                strokeWidth={3}
                fill={`url(#gradient-${key})`}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}