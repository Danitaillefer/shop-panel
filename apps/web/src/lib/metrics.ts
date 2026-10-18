import type { AdSpend, Order, Product } from "../types";
import { ORDER_FIXED_FEE } from "./config";

export interface DashboardMetrics {
  profit: number;
  orderCount: number;
  revenue: number;
  totalExpenses: number;
  cogs: number;
  margin: number;
  paymentFees: number;
  units: number;
  adsSpend: number;
  fixedFees: number;
}

export function getDashboardMetrics(orders: Order[], products: Product[], adSpend: AdSpend[]): DashboardMetrics {
  return {
    profit: getProfit(orders, products, adSpend),
    orderCount: getOrderCount(orders),
    revenue: getRevenue(orders),
    totalExpenses: getTotalExpenses(orders, products, adSpend),
    cogs: getCogs(orders, products),
    paymentFees : getPaymentFees(orders),
    units : getUnitsSold(orders),
    adsSpend : getAdSpendTotal(adSpend),
    fixedFees : getFixedFees(orders),
    margin: getMargin(orders, products, adSpend)
  }
}


// FACTURACIÓN 
export function getRevenue(orders: Order[]): number{
    const paidTotals = getPaidOrders(orders).map((order) => order.total);
    return paidTotals.reduce((acum, total) => acum + total, 0);
}

//GASTO EN PUBLICIDAD
export function getAdSpendTotal(adSpends: AdSpend[]): number{
    return adSpends.reduce((acum, adSpend) => acum + adSpend.amount, 0);
}


//COSTE TOTAL DE LOS PEDIDOS
export function getTotalOrderCosts(orders: Order[], products: Product[]): number {
  return getCostOrders(orders)
  .reduce((sum, order) => sum + getOrderCost(order, products), 0)
}

export function getOrderCost(order: Order, products: Product[]): number {
  const productCost = order.supplierCost ?? getEstimatedProductCost(order, products)
  return productCost + ORDER_FIXED_FEE + order.paymentFee
}

export function getEstimatedProductCost(order: Order, products: Product[]): number {
    return order.items.reduce((sum, item) => {
        const product = products.find((p) => p.id === item.productId)
        const unitCost = product?.estimatedCost ?? 0
        return sum + unitCost * item.quantity
    }, 0)
}
// BENEFICIO
export function getProfit(orders: Order[], products: Product[], adSpends: AdSpend[]):number{
  const revenue = getRevenue(orders)
  const costs = getTotalOrderCosts(orders, products)
  const ads = getAdSpendTotal(adSpends)
  return revenue - costs - ads
}

//MARGEN
export function getMargin(orders: Order[], products: Product[], adSpends: AdSpend[]): number {
  const revenue = getRevenue(orders)
  if (revenue === 0) return 0
  return getProfit(orders, products, adSpends) / revenue
}

export function getChangePercent(current: number, previous: number): number{
    if (previous === 0) return 0;
    return Math.trunc((current - previous) / Math.abs(previous) * 100);
}

// GASTOS TOTALES
export function getTotalExpenses(orders: Order[], products: Product[], adSpends: AdSpend[]): number{
  const costs = getTotalOrderCosts(orders, products);
  const ads = getAdSpendTotal(adSpends);
  return costs + ads; 
}

// NÚMERO DE PEDIDOS
export function getOrderCount(orders: Order[]): number{
  return getPaidOrders(orders).length;
}

// COMISIONES DE PAGO
export function getPaymentFees(orders: Order[]): number{
  return getCostOrders(orders).reduce((acum, order) => acum + order.paymentFee, 0);
}

// COSTE DEL PRODUCTO
export function getCogs(orders: Order[], products: Product[]): number{
  return getCostOrders(orders)
  .reduce((sum, order) => sum + getProductCost(order, products), 0)
}

export function getProductCost(order: Order, products: Product[]): number{
  const productCost = order.supplierCost ?? getEstimatedProductCost(order, products);
  return productCost;
}

// TOTAL UNIDADES VENDIDAS
export function getUnitsSold(orders: Order[]): number{
  return getPaidOrders(orders).reduce((total, order) => {
    return total + order.items.reduce((sum, item) => sum + item.quantity,0);
  },0)
}

// TASAS FIJAS
export function getFixedFees(orders:Order[]): number{
  return getCostOrders(orders).length * ORDER_FIXED_FEE;
}

// PEDIDOS QUE GENERAN COSTES
function getCostOrders(orders: Order[]): Order[]{
  return orders.filter((order) => order.paymentStatus !== 'PENDING');
}

function getPaidOrders(orders: Order[]): Order[] {
  return orders.filter((order) => order.paymentStatus === 'PAID')
}