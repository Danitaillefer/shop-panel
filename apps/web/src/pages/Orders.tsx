import { useState } from "react"
import { orders } from "../data/orders"
import type { FulfillmentStatus } from "../types"
import { DEMO_TODAY } from "../lib/config"
import { isOrderDelayed } from "../lib/orders"
import { PageHeader } from "../components/PageHeader"
import { ListFilter, Search } from "lucide-react"
import { DataTable } from "../components/DataTable"
import { ORDER_COLUMNS } from "../components/orders/orderColumns"
import { FULFILLMENT_STATUS_LABELS } from "../lib/labels"


type Panel = 'search' | 'filter'

function Orders(){
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<FulfillmentStatus | 'ALL'>('ALL');
    const [openPanel, setOpenPanel] = useState<Panel | null>(null)

    const sortedOrders = [...orders].sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    const filteredOrders = sortedOrders.filter((order) => {
        const matchesSearch =
        order.customerName.toLowerCase().includes(search.toLowerCase()) || order.number.includes(search)
        const matchesStatus = statusFilter === 'ALL' || order.fulfillmentStatus === statusFilter
        return matchesSearch && matchesStatus;
    })

    const delayedCount = orders.filter((order) => isOrderDelayed(order, DEMO_TODAY)).length
    const togglePanel =  (panel: Panel) => {
        setOpenPanel((prev) => (prev === panel ? null: panel))
    }
    
    return(
        <>
            <PageHeader title="Pedidos de tus" highlight="Clientes.">
                <div className="control flex items-center gap-1 p-1">
                    <button 
                        type="button" 
                        aria-label="Buscar" 
                        onClick={() => togglePanel('search')}
                        className={`flex items-center justify-center rounded-full size-8 text-muted  ${openPanel === 'search' ? 'bg-foreground text-surface ': '' }`}
                        >
                        <Search className="size-4" aria-hidden="true"/>
                    </button>
                    {openPanel === 'search' && 
                        <input
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            onBlur={() => {
                                if (search === '') setOpenPanel(null)
                                }}
                            placeholder="Buscar por pedido o cliente"
                            className="bg-transparent px-1.5 placeholder:text-muted outline-none"
                            aria-label='Buscar pedidos'
                            autoFocus
                        />}
                    <button 
                        type="button" 
                        aria-label="Filtro por estado" 
                        onClick={() => togglePanel('filter')}
                        className={`flex items-center justify-center rounded-full size-8 text-muted  ${openPanel === 'filter' ? 'bg-foreground text-surface ': '' }`}>
                        <ListFilter className="size-4"/>
                    </button>
                    {openPanel === 'filter' &&
                    <select
                        value={statusFilter}
                        onChange={(event) => setStatusFilter(event.target.value as FulfillmentStatus | 'ALL')}
                        onBlur={() => {
                            if (statusFilter === 'ALL') setOpenPanel(null)
                        }}
                        className="bg-transparent text-muted px-1.5 outline-none"
                        autoFocus
                        >
                        <option value="ALL" className="bg-surface text-muted">Todos los estados</option>
                        {Object.entries(FULFILLMENT_STATUS_LABELS).map(([value,label]) => (
                            <option key={value} value={value} className="bg-surface text-muted">{label}</option>
                        ))}
                    </select>}
                </div>
            </PageHeader>  
            {delayedCount > 0 && <p>⚠️ {delayedCount} pedidos atrasados</p>}
            <DataTable
                rows={filteredOrders}
                columns={ORDER_COLUMNS}
                getRowKey={(order) => order.id}
                getRowClassName={(order) => (isOrderDelayed(order, DEMO_TODAY) ? 'bg-negative/10' : '')}
            />
        </>
    )
}

export default Orders