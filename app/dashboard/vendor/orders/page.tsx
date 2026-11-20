import React from "react"
import { getOrders } from "@/lib/api/orders"

const VendorOrdersPage = async () => {
  try {
    const orders = await getOrders()

    console.log("Orders:", orders)
  } catch (error) {
    console.error("Failed to fetch orders:", error)
  }

  return <div>orders</div>
}

export default VendorOrdersPage