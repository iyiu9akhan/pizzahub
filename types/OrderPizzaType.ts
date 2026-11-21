export interface OrderItemInput {
  itemId: string
  quantity: number
}

// Order input sent to POST /order
// NEVER send customerId, price, total, vendorId, or status.
export interface OrderPizzaInput {
  items: OrderItemInput[]
  deliveryAddress: string
  customerPhone: string
}

export interface OrderItemDetails {
  itemId: string
  itemName: string
  price: number
  quantity: number
  image?: string
}

export type OrderStatus = "pending" | "accepted" | "rejected" | "cancelled"
export type FulfillmentStatus = "cooking" | "on_the_way" | "delivered"

// Order object returned by the backend
export interface Order {
  _id: string
  customerId: string
  customerName?: string
  customerEmail?: string
  customerPhone?: string
  deliveryAddress?: string
  items: OrderItemDetails[]
  totalAmount: number
  vendorId?: string
  vendorName?: string
  status: OrderStatus
  fulfillmentStatus?: FulfillmentStatus
  createdAt?: string
  updatedAt?: string
}

export type OrderPizzaType = OrderPizzaInput
export default OrderPizzaInput
