import { useState } from "react"
import StatusBadge from "../components/StatusBadge"
import { orders } from "../data/orders"
import { FULFILLMENT_STATUS_LABELS, FULFILLMENT_STATUS_TONES, PAYMENT_STATUS_LABELS, PAYMENT_STATUS_TONES, SHIPMENT_STATUS_LABELS, SHIPMENT_STATUS_TONES } from "../lib/labels"
import type { FulfillmentStatus } from "../types"
import { DEMO_TODAY } from "../lib/config"
import { isOrderDelayed } from "../lib/orders"
import { currencyFormatter, dateFormatter } from "../lib/formatters"
import { PageHeader } from "../components/PageHeader"
import { ListFilter, Search } from "lucide-react"


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
            <table>
                <thead>
                    <tr>
                        <th> Pedido </th>
                        <th> Fecha </th>
                        <th> Cliente </th>
                        <th> Total </th>
                        <th> Pago </th>
                        <th> Preparación </th>
                        <th> Envío </th>
                    </tr>
                </thead>
                <tbody>
                    {filteredOrders.map((order) =>(
                        <tr key={order.id} className={isOrderDelayed(order, DEMO_TODAY) ? 'bg-red-50' : ''}>
                            <td>{order.number}</td>
                            <td>{dateFormatter.format(new Date(order.createdAt))}</td>
                            <td>{order.customerName}</td>
                            <td>{currencyFormatter.format(order.total)}</td>
                            <td>
                                <StatusBadge
                                    label={PAYMENT_STATUS_LABELS[order.paymentStatus]}
                                    tone={PAYMENT_STATUS_TONES[order.paymentStatus]}
                                />
                            </td>
                            <td>
                                <StatusBadge
                                    label={FULFILLMENT_STATUS_LABELS[order.fulfillmentStatus]}
                                    tone={FULFILLMENT_STATUS_TONES[order.fulfillmentStatus]}
                                />
                            </td>
                            <td>
                                {order.shipmentStatus ? (
                                    <StatusBadge
                                        label={SHIPMENT_STATUS_LABELS[order.shipmentStatus]}
                                        tone={SHIPMENT_STATUS_TONES[order.shipmentStatus]}
                                    /> ) : ( '-' )
                                }
                            </td>
                        </tr>
                    ))}
                    
                </tbody>
            </table>
        </>
    )
}

export default Orders