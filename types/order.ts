// Shared order types used by customer and vendor dashboards.

export type OrderStatus = "pending" | "accepted" | "rejected" | "cancelled"
export type FulfillmentStatus = "cooking" | "on_the_way" | "delivered"

export interface OrderItem {
  itemName?: string
  name?: string
  quantity?: number
  price?: number
  image?: string
}

// A single customer order as stored in the database
export interface CustomerOrder {
  _id: string
  customerId?: string
  customerName?: string
  customerEmail?: string
  customerPhone?: string
  deliveryAddress?: string
  deliveryDate?: string
  message?: string
  items: OrderItem[]
  totalAmount: number
  status: OrderStatus
  fulfillmentStatus?: FulfillmentStatus,
  vendorId?: string
  vendorName?: string
  createdAt?: string
}
