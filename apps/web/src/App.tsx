import { KpiCard } from "./components/KpiCard"
import {getCosts, getMargin, getProfit, getRevenue } from "./lib/metrics"
import {adSpend} from "./data/adSpend"
import {orders} from "./data/orders"
import {products} from "./data/products"

function App() {
  const revenue = getRevenue(orders);
  const profit = getProfit(orders, products, adSpend);
  const margin = getMargin(orders, products, adSpend);
  const costs = getCosts(orders, products, adSpend);
  return (
    <div className="min-h-screen bg-gray-200 p-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
      <KpiCard title="Facturación" value={revenue} change={12} /> 
      <KpiCard title="Beneficio" value={profit} change={10}/> 
      <KpiCard title="Margen" value={margin} change={8} format="percent"/> 
      <KpiCard title="Gasto" value={costs} change={-2}/> 
      </div>
    </div>
  )
}

export default App
