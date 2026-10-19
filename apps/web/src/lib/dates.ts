import type { AdSpend, Order } from "../types";
import { MS_PER_DAY } from "./config";

export function filterOrdersByDate(orders: Order[], from: Date, to: Date): Order[]{
    return orders.filter((order) => {
        const date = new Date(order.createdAt);
        return from <= date && date <= to 
    });
}

export function filterAdSpendByDate(adSpend: AdSpend[], from: Date, to: Date): AdSpend[]{
    return adSpend.filter((entry) => {
        const date = new Date(entry.date);
        return from <= date && date <= to 
    })
}

export function subtractDays(date: Date, days: number): Date {
    return new Date(date.getTime() - days * MS_PER_DAY)
}