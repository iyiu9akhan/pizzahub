// Currency constants and helper functions.
export const CURRENCY_SYMBOL = "৳"

// Format numeric price into BDT currency string
export function formatPrice(amount: number): string {
  return `${CURRENCY_SYMBOL}${amount.toLocaleString("en-BD")}`
}
