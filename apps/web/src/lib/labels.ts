import type { FulfillmentStatus, PaymentStatus, ShipmentStatus } from '../types'

export type StatusTone = 'success' | 'warning' | 'danger' | 'neutral'

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  PAID: 'Pagado',
  PENDING: 'Pendiente',
  PARTIALLY_PAID: 'Pagado parcialmente',
  REFUNDED: 'Reembolsado',
  PARTIALLY_REFUNDED: 'Reembolsado parcialmente',
}

export const FULFILLMENT_STATUS_LABELS: Record<FulfillmentStatus, string> = {
  FULFILLED: 'Preparado',
  UNFULFILLED: 'No preparado',
  PARTIALLY_FULFILLED: 'Preparado parcialmente',
  SCHEDULED: 'Programado',
  ON_HOLD: 'En espera',
  REQUEST_DECLINED: 'Solicitud rechazada',
}

export const SHIPMENT_STATUS_LABELS: Record<ShipmentStatus, string> = {
  LABEL_PURCHASED: 'Etiqueta creada',
  IN_TRANSIT: 'En tránsito',
  OUT_FOR_DELIVERY: 'En reparto',
  ATTEMPTED_DELIVERY: 'Intento fallido',
  READY_FOR_PICKUP: 'En punto de recogida',
  DELIVERED: 'Entregado',
  FAILURE: 'Incidencia',
}

export const PAYMENT_STATUS_TONES: Record<PaymentStatus, StatusTone> = {
  PAID: 'success',
  PENDING: 'warning',
  PARTIALLY_PAID: 'warning',
  REFUNDED: 'danger',
  PARTIALLY_REFUNDED: 'danger',
}

export const FULFILLMENT_STATUS_TONES: Record<FulfillmentStatus, StatusTone> = {
  FULFILLED: 'success',
  UNFULFILLED: 'warning',
  PARTIALLY_FULFILLED: 'warning',
  SCHEDULED: 'warning',
  ON_HOLD: 'warning',
  REQUEST_DECLINED: 'danger',
}

export const SHIPMENT_STATUS_TONES: Record<ShipmentStatus, StatusTone> = {
  LABEL_PURCHASED: 'neutral',
  IN_TRANSIT: 'neutral',
  OUT_FOR_DELIVERY: 'neutral',
  ATTEMPTED_DELIVERY: 'warning',
  READY_FOR_PICKUP: 'warning',
  DELIVERED: 'success',
  FAILURE: 'danger',
}