import StatusBadge from "../components/StatusBadge"
import { orders } from "../data/orders"
import { FULFILLMENT_STATUS_LABELS, FULFILLMENT_STATUS_TONES, PAYMENT_STATUS_LABELS, PAYMENT_STATUS_TONES, SHIPMENT_STATUS_LABELS, SHIPMENT_STATUS_TONES } from "../lib/labels"

const dateFormatter = new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
})

const currencyFormatter = new Intl.NumberFormat('es-ES',{
    style:'currency',
    currency: 'EUR'
})


function Orders(){

    const sortedOrders = [...orders].sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    
    return(
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
            {sortedOrders.map((order) =>(
                <tr key={order.id}>
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
    )
}

export default Orders