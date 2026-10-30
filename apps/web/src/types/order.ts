
export type PaymentStatus =
  | 'PAID'                
  | 'PENDING'             
  | 'PARTIALLY_PAID'     
  | 'REFUNDED'            
  | 'PARTIALLY_REFUNDED' 

export type FulfillmentStatus =
  | 'FULFILLED'            
  | 'UNFULFILLED'          
  | 'PARTIALLY_FULFILLED'  
  | 'SCHEDULED'            
  | 'ON_HOLD'              
  | 'REQUEST_DECLINED'     

export type ShipmentStatus =
  | 'LABEL_PURCHASED'      
  | 'IN_TRANSIT'         
  | 'OUT_FOR_DELIVERY'    
  | 'ATTEMPTED_DELIVERY'  
  | 'READY_FOR_PICKUP'   
  | 'DELIVERED'           
  | 'FAILURE'    
  
  export interface OrderItem {
    productId: string;
    quantity: number;
    unitPrice: number;
  }

  export interface Order {
    id: string;
    number: string;
    customerName: string;
    customerEmail: string;
    createdAt: string;
    paymentStatus: PaymentStatus;
    fulfillmentStatus: FulfillmentStatus;
    shipmentStatus?: ShipmentStatus;
    total: number;
    discounts: number;
    paymentFee: number;
    supplierCost?:number;
    items: OrderItem[];
  }