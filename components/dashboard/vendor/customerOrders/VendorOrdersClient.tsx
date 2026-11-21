"use client"

import { useState } from "react"
import CustomerOrdersCard, {
  OrderUpdate,
  VendorOrder,
} from "./CustomerOrdersCard"
import { toastSuccess, toastError } from "@/lib/toast"
import { updateOrderStatus } from "@/lib/actions/OrderStatus"

interface Props {
  initialOrders: VendorOrder[]
}

// Toast text for each update
const MESSAGES: Record<string, string> = {
  accepted: "Order accepted",
  rejected: "Order rejected",
  cooking: "Order is now cooking",
  on_the_way: "Order is out for delivery",
  delivered: "Order marked as delivered",
}

// Keeps orders in state so the table updates right after a change
const VendorOrdersClient = ({ initialOrders }: Props) => {
  const [orders, setOrders] = useState<VendorOrder[]>(initialOrders)

  // Save to server first, then update the UI
  const handleUpdate = async (id: string, update: OrderUpdate) => {
    try {
      await updateOrderStatus(id, update)
      setOrders((prev) =>
        prev.map((o) => (o._id === id ? { ...o, ...update } : o))
      )
      const key = "status" in update ? update.status : update.fulfillmentStatus
      toastSuccess(MESSAGES[key])
    } catch {
      toastError("Failed to update order", "Please try again.")
    }
  }

  return <CustomerOrdersCard orders={orders} onUpdateStatus={handleUpdate} />
}

export default VendorOrdersClient