// Formats a number to US Dollar (USD) currency representation using standard locale formatting.
export const formatUSD = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount)

// Formats a Stripe cents amount (e.g. 2900) to USD string (e.g. "$29")
export const formatUSDCents = (cents: number) => formatUSD(cents / 100)
