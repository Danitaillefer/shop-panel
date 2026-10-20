import { KpiCard } from "../components/KpiCard";
import { filterAdSpendByDate, filterOrdersByDate, subtractDays } from "../lib/dates"
import { DEMO_TODAY } from "../lib/config";
import { orders } from "../data/orders";
import { products } from "../data/products";
import { adSpend } from "../data/adSpend";
import { getChangePercent, getDashboardMetrics, getPointsChange, type DashboardMetrics } from "../lib/metrics";

const PERIOD_DAYS = 14;


function Dashboard() {

  const currentFrom = subtractDays(DEMO_TODAY, PERIOD_DAYS);
  const previousFrom = subtractDays(DEMO_TODAY, PERIOD_DAYS * 2);

  const currentOrders = filterOrdersByDate(orders, currentFrom, DEMO_TODAY);
  const previousOrders = filterOrdersByDate(orders, previousFrom, currentFrom);
  const currentAdSpend = filterAdSpendByDate(adSpend, currentFrom, DEMO_TODAY);
  const previousAdSpend = filterAdSpendByDate(adSpend, previousFrom, currentFrom);

  const current = getDashboardMetrics(currentOrders, products, currentAdSpend);
  const previous = getDashboardMetrics(previousOrders, products, previousAdSpend);

  const change = (key: keyof DashboardMetrics) => getChangePercent(current[key], previous[key])
  const pointsChange = (key: keyof DashboardMetrics) => getPointsChange(current[key], previous[key])

  return (
    <div className="p-4">
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
    </div>
  )
}

export default Dashboard
