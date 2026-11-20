export type OrderStatus =
  "pending" | "preparing" | "delivering" | "delivered" | "cancelled"

export interface OrderItem {
  itemId: string
  itemName: string
  price: number
  quantity: number
  image?: string
}

export interface OrderPizzaType {
  vendorId: string
  vendorName?: string
  customerId: string
  customerName: string
  customerEmail: string
  customerPhone: string
  deliveryAddress: string

  items: OrderItem[]
  totalAmount: number
  status?: OrderStatus
}

export interface Order extends OrderPizzaType {
  _id: string
  status: OrderStatus
  createdAt: string
  updatedAt?: string
}

export default OrderPizzaType
