
import type { Order } from '../../types'
import StatusBadge from '../StatusBadge'
import { currencyFormatter, dateFormatter } from '../../lib/formatters'
import {
  FULFILLMENT_STATUS_LABELS,
  FULFILLMENT_STATUS_TONES,
  PAYMENT_STATUS_LABELS,
  PAYMENT_STATUS_TONES,
  SHIPMENT_STATUS_LABELS,
  SHIPMENT_STATUS_TONES,
} from '../../lib/labels'
import type { Column } from '../DataTable'

export const ORDER_COLUMNS: Column<Order>[] = [
  {
    header: 'Pedido',
    render: (order) => order.number,
    className: 'font-medium',
  },
  {
    header: 'Fecha',
    render: (order) => dateFormatter.format(new Date(order.createdAt)),
    className: 'text-muted',
  },
  {
    header: 'Cliente',
    render: (order) => order.customerName,
  },
  {
    header: 'Total',
    render: (order) => currencyFormatter.format(order.total),
    className: 'font-medium tabular-nums',
  },
  {
    header: 'Pago',
    render: (order) => (
      <StatusBadge
        label={PAYMENT_STATUS_LABELS[order.paymentStatus]}
        tone={PAYMENT_STATUS_TONES[order.paymentStatus]}
      />
    ),
  },
  {
    header: 'Preparación',
    render: (order) => (
      <StatusBadge
        label={FULFILLMENT_STATUS_LABELS[order.fulfillmentStatus]}
        tone={FULFILLMENT_STATUS_TONES[order.fulfillmentStatus]}
      />
    ),
  },
  {
    header: 'Envío',
    render: (order) =>
      order.shipmentStatus ? (
        <StatusBadge
          label={SHIPMENT_STATUS_LABELS[order.shipmentStatus]}
          tone={SHIPMENT_STATUS_TONES[order.shipmentStatus]}
        />
      ) : (
        <span className="text-muted">—</span>
      ),
  },
]