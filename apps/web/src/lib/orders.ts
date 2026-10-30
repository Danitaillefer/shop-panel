import type { Order } from "../types";
import { DELAYED_ORDER_DAYS } from "./config";
import { subtractDays } from "./dates";


export function isOrderDelayed(order: Order, now: Date): boolean {
    const deadline= subtractDays(now, DELAYED_ORDER_DAYS); 
    return (
        order.paymentStatus === 'PAID' &&
        order.fulfillmentStatus === 'UNFULFILLED' &&
        new Date(order.createdAt) < deadline
    )
}