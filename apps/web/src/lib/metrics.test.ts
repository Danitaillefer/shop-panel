import { describe, expect, it } from 'vitest'
import type { AdSpend, Order, Product } from '../types'
import { ORDER_FIXED_FEE } from './config'
import {
  getAdSpendTotal,
  getChangePercent,
  getCogs,
  getEstimatedProductCost,
  getFixedFees,
  getMargin,
  getOrderCount,
  getPaymentFees,
  getPointsChange,
  getProductCost,
  getProfit,
  getRevenue,
  getTotalExpenses,
  getUnitsSold,
} from './metrics'

// ─── Fábricas de datos de prueba ──────────────────────────

function makeOrder(overrides: Partial<Order> = {}): Order {
  return {
    id: 'ord-1',
    number: '#1',
    customerName: 'Cliente',
    customerEmail: 'cliente@example.com',
    createdAt: '2026-10-16T10:00:00Z',
    paymentStatus: 'PAID',
    fulfillmentStatus: 'FULFILLED',
    total: 100,
    discounts: 0,
    paymentFee: 0,
    items: [],
    ...overrides,
  }
}

const products: Product[] = [
  { id: 'p1', title: 'Funda', price: 25, estimatedCost: 5 },
  { id: 'p2', title: 'Cargador', price: 35, estimatedCost: 10 },
]

// Un escenario realista: dos pagados, un reembolso y un pendiente
const orders: Order[] = [
  // Pagado, sin factura del proveedor: coste estimado 2 × 5 = 10
  makeOrder({ total: 100, paymentFee: 2, items: [{ productId: 'p1', quantity: 2, unitPrice: 50 }] }),
  // Pagado, con factura del proveedor: coste real 20
  makeOrder({ total: 50, paymentFee: 1, supplierCost: 20, items: [{ productId: 'p2', quantity: 1, unitPrice: 50 }] }),
  // Reembolsado: no factura, pero sí cuesta (5)
  makeOrder({ total: 80, paymentFee: 1.5, paymentStatus: 'REFUNDED', items: [{ productId: 'p1', quantity: 1, unitPrice: 80 }] }),
  // Pendiente: ni factura ni cuesta
  makeOrder({ total: 60, paymentFee: 1, paymentStatus: 'PENDING', items: [{ productId: 'p2', quantity: 3, unitPrice: 20 }] }),
]

const adSpend: AdSpend[] = [
  { date: '2026-10-15', channel: 'meta', amount: 10 },
  { date: '2026-10-16', channel: 'meta', amount: 5 },
]

// Valores esperados del escenario
const COGS = 10 + 20 + 5
const PAYMENT_FEES = 2 + 1 + 1.5
const FIXED_FEES = 3 * ORDER_FIXED_FEE // 3 pedidos generan coste
const ADS = 15
const REVENUE = 150

// ─── Coste de un pedido ───────────────────────────────────

describe('getEstimatedProductCost', () => {
  it('multiplica el coste estimado por las unidades', () => {
    const order = makeOrder({ items: [{ productId: 'p1', quantity: 3, unitPrice: 25 }] })
    expect(getEstimatedProductCost(order, products)).toBe(15)
  })

  it('cuenta 0 si el producto no existe en el catálogo', () => {
    const order = makeOrder({ items: [{ productId: 'desconocido', quantity: 1, unitPrice: 25 }] })
    expect(getEstimatedProductCost(order, products)).toBe(0)
  })
})

describe('getProductCost', () => {
  it('usa el coste real del proveedor si existe', () => {
    const order = makeOrder({ supplierCost: 42, items: [{ productId: 'p1', quantity: 1, unitPrice: 25 }] })
    expect(getProductCost(order, products)).toBe(42)
  })

  it('usa la estimación si no hay factura', () => {
    const order = makeOrder({ items: [{ productId: 'p2', quantity: 2, unitPrice: 35 }] })
    expect(getProductCost(order, products)).toBe(20)
  })

  it('respeta un coste real de 0 (no lo confunde con "sin factura")', () => {
    const order = makeOrder({ supplierCost: 0, items: [{ productId: 'p2', quantity: 2, unitPrice: 35 }] })
    expect(getProductCost(order, products)).toBe(0)
  })
})

// ─── Ingresos y volumen ───────────────────────────────────

describe('ingresos y volumen', () => {
  it('getRevenue solo suma los pedidos pagados', () => {
    expect(getRevenue(orders)).toBe(REVENUE)
  })

  it('getOrderCount solo cuenta los pedidos pagados', () => {
    expect(getOrderCount(orders)).toBe(2)
  })

  it('getUnitsSold solo cuenta las unidades de los pedidos pagados', () => {
    expect(getUnitsSold(orders)).toBe(3)
  })

  it('devuelve 0 sin pedidos', () => {
    expect(getRevenue([])).toBe(0)
    expect(getOrderCount([])).toBe(0)
  })
})

// ─── Gastos ───────────────────────────────────────────────

describe('gastos', () => {
  it('getCogs incluye los reembolsados y excluye los pendientes', () => {
    expect(getCogs(orders, products)).toBe(COGS)
  })

  it('getPaymentFees suma las comisiones de los pedidos con coste', () => {
    expect(getPaymentFees(orders)).toBeCloseTo(PAYMENT_FEES)
  })

  it('getFixedFees cobra la tasa a cada pedido con coste', () => {
    expect(getFixedFees(orders)).toBe(FIXED_FEES)
  })

  it('getAdSpendTotal suma todo el gasto en publicidad', () => {
    expect(getAdSpendTotal(adSpend)).toBe(ADS)
  })

  it('getTotalExpenses es la suma de todo el desglose', () => {
    expect(getTotalExpenses(orders, products, adSpend)).toBeCloseTo(COGS + PAYMENT_FEES + FIXED_FEES + ADS)
  })
})

// ─── Resultados ───────────────────────────────────────────

describe('resultados', () => {
  it('getProfit es la facturación menos los gastos totales', () => {
    const expected = REVENUE - (COGS + PAYMENT_FEES + FIXED_FEES + ADS)
    expect(getProfit(orders, products, adSpend)).toBeCloseTo(expected)
  })

  it('getMargin es el beneficio entre la facturación', () => {
    const profit = getProfit(orders, products, adSpend)
    expect(getMargin(orders, products, adSpend)).toBeCloseTo(profit / REVENUE)
  })

  it('getMargin devuelve 0 si no hay facturación (no divide entre 0)', () => {
    expect(getMargin([], products, adSpend)).toBe(0)
  })
})

// ─── Comparación de periodos ──────────────────────────────

describe('getChangePercent', () => {
  it('calcula la subida en porcentaje', () => {
    expect(getChangePercent(120, 100)).toBe(20)
  })

  it('calcula la bajada en porcentaje', () => {
    expect(getChangePercent(75, 100)).toBe(-25)
  })

  it('devuelve 0 si el periodo anterior es 0', () => {
    expect(getChangePercent(50, 0)).toBe(0)
  })

  it('pasar de pérdidas a beneficios cuenta como mejora', () => {
    expect(getChangePercent(50, -100)).toBe(150)
  })
})

describe('getPointsChange', () => {
  it('devuelve la diferencia en puntos porcentuales', () => {
    expect(getPointsChange(0.19, 0.05)).toBeCloseTo(14)
  })
})