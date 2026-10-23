import { KpiCard } from "../components/KpiCard";
import { filterAdSpendByDate, filterOrdersByDate, subtractDays } from "../lib/dates"
import { DEFAULT_PERIOD_DAYS, DEMO_TODAY } from "../lib/config";
import { orders } from "../data/orders";
import { products } from "../data/products";
import { adSpend } from "../data/adSpend";
import { getChangePercent, getDailySeries, getDashboardMetrics, getPointsChange, type DashboardMetrics } from "../lib/metrics";
import { DailyChart } from "../components/DailyChart";
import { shortDateFormatter } from "../lib/formatters";
import { PeriodSelector } from "../components/PeriodSelector";
import { useState } from "react";

const PERIOD_DAYS = 14;


function Dashboard() {
  const [periodDays, setPeriodDays] = useState(DEFAULT_PERIOD_DAYS)

  const currentFrom = subtractDays(DEMO_TODAY, periodDays);
  const previousFrom = subtractDays(DEMO_TODAY, periodDays * 2);

  const currentOrders = filterOrdersByDate(orders, currentFrom, DEMO_TODAY);
  const previousOrders = filterOrdersByDate(orders, previousFrom, currentFrom);
  const currentAdSpend = filterAdSpendByDate(adSpend, currentFrom, DEMO_TODAY);
  const previousAdSpend = filterAdSpendByDate(adSpend, previousFrom, currentFrom);

  const current = getDashboardMetrics(currentOrders, products, currentAdSpend);
  const previous = getDashboardMetrics(previousOrders, products, previousAdSpend);

  const change = (key: keyof DashboardMetrics) => getChangePercent(current[key], previous[key])
  const pointsChange = (key: keyof DashboardMetrics) => getPointsChange(current[key], previous[key])

  const dailySeries = getDailySeries(orders, products, adSpend, DEMO_TODAY, periodDays)

  const periodStart = new Date(currentFrom.getTime() + 1000)
  const periodLabel = shortDateFormatter.formatRange(periodStart, DEMO_TODAY);

  return (
    <div className="p-4 flex flex-col gap-4">
      <div className="flex mb-8 items-end place-content-between">
        <div className="">
          <span className="text-sm font-medium text-muted">{periodLabel} · vs periodo anterior</span>
          <h1 className="mt-2 text-5xl font-bold tracking-tighter md:text-6xl">Tu negocio, <span className="bg-brand-gradient bg-clip-text text-transparent">en claro.</span></h1>
        </div>
        <PeriodSelector value={periodDays} onChange={setPeriodDays}/>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2">
      <KpiCard title="Beneficio" value={current.profit} change={change('profit')}/> 
      <KpiCard title="Pedidos" value={current.orderCount} change={change('orderCount')} format="decimal"/> 
      <KpiCard title="Facturación" value={current.revenue} change={change('revenue')} /> 
      <KpiCard title="Gastos totales" value={current.totalExpenses} change={change('totalExpenses')} /> 
      <KpiCard title="COGS" value={current.cogs} change={change('cogs')} /> 
      <KpiCard title="Margen" value={current.margin} change={pointsChange('margin')} format="percent" changeFormat="pp"/> 
      <KpiCard title="Comisiones de pago" value={current.paymentFees} change={change('paymentFees')}/> 
      <KpiCard title="Unidades Vendidas" value={current.units} change={change('units')} format="decimal"/> 
      <KpiCard title="Gasto en ads" value={current.adsSpend} change={change('adsSpend')} /> 
      <KpiCard title="Tasas fijas" value={current.fixedFees} change={change('fixedFees')} /> 
      </div>
      <DailyChart data={dailySeries} />
    </div>
  )
}

export default Dashboard
