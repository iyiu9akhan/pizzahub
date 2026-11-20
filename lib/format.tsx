// Formats a number to Bangladeshi Taka (BDT) currency representation using standard locale formatting.
export const formatBDT = (amount: number) =>
  new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(amount)
