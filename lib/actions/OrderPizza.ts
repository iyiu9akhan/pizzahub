import OrderPizzaType from "@/types/OrderPizzaType"

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export async function OrderPizza(data: OrderPizzaType) {
  const response = await fetch(`${BASE_URL}/order`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(data),
  })
  return response.json()
}

export default OrderPizza
