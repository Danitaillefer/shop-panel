import { KpiCard } from "./components/KpiCard"

function App() {
  return (
    <div className="min-h-screen bg-gray-200 p-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
      <KpiCard title="Facturación" value={12000} change={12} /> 
      <KpiCard title="Beneficio" value={4000} change={10}/> 
      <KpiCard title="Margen" value={0.25} change={8} format="percent"/> 
      <KpiCard title="Gasto" value={8000} change={-2}/> 
      </div>
    </div>
  )
}

export default App
