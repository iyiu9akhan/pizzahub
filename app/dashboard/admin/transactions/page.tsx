// Admin transactions page — /dashboard/admin/transactions
export const dynamic = "force-dynamic"

import React from "react"
import { requireRole } from "@/lib/core/server"
import { getTransactions } from "@/lib/api/admin"
import ManageTransactions from "@/components/dashboard/admin/transactions/ManageTransactions"

const AdminTransactionsPage = async () => {
  await requireRole("admin")
  const transactions = await getTransactions()
  return <ManageTransactions transactions={transactions} />
}

export default AdminTransactionsPage
