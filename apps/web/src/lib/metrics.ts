import type { AdSpend, Order, Product } from "../types";
import { ORDER_FIXED_FEE } from "./config";


export function getRevenue(orders: Order[]): number{
    const paidTotals = orders.filter((order) => order.paymentStatus === 'PAID').map((order) => order.total);
    return paidTotals.reduce((acum, total) => acum + total, 0);
}

export function getAdSpendTotal(adSpends: AdSpend[]): number{
    return adSpends.reduce((acum, adSpend) => acum + adSpend.amount, 0);
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

export function getTotalOrderCosts(orders: Order[], products: Product[]): number {
  return orders
    .filter((order) => order.paymentStatus !== 'PENDING')
    .reduce((sum, order) => sum + getOrderCost(order, products), 0)
}

export function getProfit(orders: Order[], products: Product[], adSpends: AdSpend[]):number{
  const revenue = getRevenue(orders)
  const costs = getTotalOrderCosts(orders, products)
  const ads = getAdSpendTotal(adSpends)
  return revenue - costs - ads
}

export function getMargin(orders: Order[], products: Product[], adSpend: AdSpend[]): number {
  const revenue = getRevenue(orders)
  if (revenue === 0) return 0
  return getProfit(orders, products, adSpend) / revenue
}