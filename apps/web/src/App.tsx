import { KpiCard } from "./components/KpiCard"
import {getTotalExpenses, getMargin, getProfit, getRevenue, getCogs, getPaymentFees, getUnitsSold, getAdSpendTotal, getFixedFees, getOrderCount } from "./lib/metrics"
import {adSpend} from "./data/adSpend"
import {orders} from "./data/orders"
import {products} from "./data/products"

function App() {
  const revenue = getRevenue(orders);
  const profit = getProfit(orders, products, adSpend);
  const margin = getMargin(orders, products, adSpend);
  const costs = getTotalExpenses(orders, products, adSpend);
  const cogs = getCogs(orders,products);
  const paymentFees = getPaymentFees(orders);
  const units = getUnitsSold(orders);
  const adsSpend = getAdSpendTotal(adSpend);
  const fixedFees = getFixedFees(orders);
  const orderCount = getOrderCount(orders);
  return (
    <div className="min-h-screen bg-gray-200 p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2">
      <KpiCard title="Beneficio" value={profit} change={10}/> 
      <KpiCard title="Pedidos" value={orderCount} change={10} format="decimal"/> 
      <KpiCard title="Facturación" value={revenue} change={12} /> 
      <KpiCard title="Gastos totales" value={costs} change={12} /> 
      <KpiCard title="COGS" value={cogs} change={12} /> 
      <KpiCard title="Margen" value={margin} change={8} format="percent"/> 
      <KpiCard title="Comisiones de pago" value={paymentFees} change={8}/> 
      <KpiCard title="Unidades Vendidas" value={units} change={8} format="decimal"/> 
      <KpiCard title="Gasto en ads" value={adsSpend} change={8} /> 
      <KpiCard title="Tasas fijas" value={fixedFees} change={8} /> 
      </div>
    </div>
  )
}

export default App
