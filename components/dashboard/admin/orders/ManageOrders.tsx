"use client"

import React, { useState, useMemo } from "react"
import {
  Bike,
  Check,
  ChefHat,
  PackageCheck,
  Search,
  Store,
  User,
  X,
  MapPin,
  Calendar,
} from "lucide-react"
import { formatBDT } from "@/lib/format"
import { updateOrderStatus } from "@/lib/actions/OrderStatus"
import { toastSuccess, toastError } from "@/lib/toast"
import LoadingButton from "@/components/ui/LoadingButton"
import { Badge } from "@/components/ui/badge"

export interface AdminOrderItem {
  itemId?: string
  itemName?: string
  name?: string
  quantity?: number
  price?: number
  image?: string
}

export interface AdminOrder {
  _id: string
  customerId?: string
  customerName?: string
  customerEmail?: string
  customerPhone?: string
  deliveryAddress?: string
  items: AdminOrderItem[]
  totalAmount: number
  vendorId?: string
  vendorName?: string
  status: "pending" | "accepted" | "rejected" | "cancelled"
  fulfillmentStatus?: "cooking" | "on_the_way" | "delivered"
  createdAt?: string
}

interface ManageOrdersProps {
  initialOrders: AdminOrder[]
}

const MESSAGES: Record<string, string> = {
  accepted: "Order accepted.",
  rejected: "Order rejected.",
  cooking: "Order is now cooking.",
  on_the_way: "Order is out for delivery.",
  delivered: "Order marked as delivered.",
}

export default function ManageOrders({ initialOrders }: ManageOrdersProps) {
  const [orders, setOrders] = useState<AdminOrder[]>(initialOrders)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const handleUpdate = async (
    id: string,
    update: {
      status?: "pending" | "accepted" | "rejected" | "cancelled"
      fulfillmentStatus?: "cooking" | "on_the_way" | "delivered"
    }
  ) => {
    setUpdatingId(id)
    try {
      const res = await updateOrderStatus(id, update)
      if (res.success) {
        setOrders((prev) =>
          prev.map((o) => (o._id === id ? { ...o, ...update } : o))
        )
        const key = update.status || update.fulfillmentStatus || ""
        toastSuccess(MESSAGES[key] || "Order updated.")
      } else {
        toastError("Failed to update order", res.message)
      }
    } catch {
      toastError("Failed to update order", "An unexpected error occurred.")
    } finally {
      setUpdatingId(null)
    }
  }

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchesSearch =
        (o.customerName?.toLowerCase() || "").includes(search.toLowerCase()) ||
        (o.customerEmail?.toLowerCase() || "").includes(search.toLowerCase()) ||
        (o.vendorName?.toLowerCase() || "").includes(search.toLowerCase()) ||
        (o.deliveryAddress?.toLowerCase() || "").includes(search.toLowerCase()) ||
        o.items.some((i) =>
          (i.itemName || i.name || "").toLowerCase().includes(search.toLowerCase())
        )

      let matchesStatus = true
      if (statusFilter === "pending") matchesStatus = o.status === "pending"
      else if (statusFilter === "accepted")
        matchesStatus = o.status === "accepted" && !o.fulfillmentStatus
      else if (statusFilter === "cooking")
        matchesStatus = o.fulfillmentStatus === "cooking"
      else if (statusFilter === "on_the_way")
        matchesStatus = o.fulfillmentStatus === "on_the_way"
      else if (statusFilter === "delivered")
        matchesStatus = o.fulfillmentStatus === "delivered"
      else if (statusFilter === "rejected")
        matchesStatus = o.status === "rejected"
      else if (statusFilter === "cancelled")
        matchesStatus = o.status === "cancelled"

      return matchesSearch && matchesStatus
    })
  }, [orders, search, statusFilter])

  return (
    <div className="w-full space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div>
        <h1 className="font-heading text-2xl font-bold text-ink sm:text-3xl">
          Manage Orders
        </h1>
        <p className="mt-1 font-text text-sm text-ink-muted">
          View all platform orders and oversee fulfillment progress.
        </p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-line bg-surface p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
          <input
            type="text"
            placeholder="Search order, customer, vendor…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-line bg-surface py-2 pl-9 pr-3.5 font-text text-sm text-ink placeholder:text-ink-muted focus:border-brand focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto">
          {[
            { id: "all", label: "All" },
            { id: "pending", label: "Pending" },
            { id: "cooking", label: "Cooking" },
            { id: "on_the_way", label: "On the way" },
            { id: "delivered", label: "Delivered" },
            { id: "rejected", label: "Rejected" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setStatusFilter(tab.id)}
              className={`rounded-xl px-3.5 py-1.5 font-heading text-xs font-semibold capitalize transition-colors ${statusFilter === tab.id
                ? "bg-brand text-white"
                : "border border-line bg-surface text-ink hover:bg-brand-soft"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line bg-surface py-16 text-center text-sm text-ink-muted">
          No orders match your filter criteria.
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filteredOrders.map((order) => {
            const isUpdating = updatingId === order._id

            return (
              <div
                key={order._id}
                className="rounded-2xl border border-line bg-surface p-5 shadow-xs transition-shadow hover:shadow-md"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  {/* Left: Customer + Vendor details */}
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="flex items-center gap-1 font-heading text-sm font-bold text-ink">
                        <User className="h-4 w-4 text-brand-fg" />
                        {order.customerName || "Customer"}
                      </span>
                      {order.customerEmail && (
                        <span className="font-text text-xs text-ink-muted">
                          ({order.customerEmail})
                        </span>
                      )}
                      {order.vendorName && (
                        <Badge
                          variant="secondary"
                          className="flex items-center gap-1 rounded-full bg-brand-soft font-text text-[11px] text-brand-fg"
                        >
                          <Store className="h-3 w-3" />
                          {order.vendorName}
                        </Badge>
                      )}
                    </div>

                    {/* Delivery & phone */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-muted">
                      {order.deliveryAddress && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5 shrink-0 text-brand-fg" />
                          {order.deliveryAddress}
                        </span>
                      )}
                      {order.customerPhone && (
                        <span>📞 {order.customerPhone}</span>
                      )}
                      {order.createdAt && (
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 shrink-0" />
                          {new Date(order.createdAt).toLocaleDateString("en-BD", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      )}
                    </div>

                    {/* Items */}
                    <p className="font-text text-xs text-ink">
                      Items:{" "}
                      <span className="font-medium">
                        {order.items
                          .map(
                            (i) =>
                              `${i.itemName || i.name || "Item"} (×${i.quantity || 1})`
                          )
                          .join(", ")}
                      </span>
                    </p>
                  </div>

                  {/* Right: Total + Status + Action Buttons */}
                  <div className="flex flex-wrap items-center gap-4 lg:justify-end">
                    <div className="text-right">
                      <p className="font-heading text-lg font-extrabold text-brand-fg">
                        {formatBDT(order.totalAmount)}
                      </p>
                      <span className="inline-block rounded-full bg-brand-soft px-2.5 py-0.5 font-heading text-[10px] font-bold text-brand-fg capitalize">
                        {order.status === "accepted"
                          ? order.fulfillmentStatus || "Accepted"
                          : order.status}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      {order.status === "pending" && (
                        <>
                          <LoadingButton
                            type="button"
                            isLoading={isUpdating}
                            loadingText="Accepting…"
                            onClick={() =>
                              handleUpdate(order._id, { status: "accepted" })
                            }
                            className="inline-flex h-9 items-center gap-1 rounded-xl bg-emerald-600 px-3.5 font-heading text-xs font-semibold text-white hover:bg-emerald-700"
                          >
                            <Check className="h-3.5 w-3.5" />
                            <span>Accept</span>
                          </LoadingButton>
                          <LoadingButton
                            type="button"
                            isLoading={isUpdating}
                            loadingText="Rejecting…"
                            onClick={() =>
                              handleUpdate(order._id, { status: "rejected" })
                            }
                            className="inline-flex h-9 items-center gap-1 rounded-xl border border-red-300 bg-surface px-3.5 font-heading text-xs font-semibold text-red-600 hover:bg-red-50 dark:border-red-500/30"
                          >
                            <X className="h-3.5 w-3.5" />
                            <span>Reject</span>
                          </LoadingButton>
                        </>
                      )}

                      {order.status === "accepted" &&
                        !order.fulfillmentStatus && (
                          <LoadingButton
                            type="button"
                            isLoading={isUpdating}
                            loadingText="Updating…"
                            onClick={() =>
                              handleUpdate(order._id, {
                                fulfillmentStatus: "cooking",
                              })
                            }
                            className="inline-flex h-9 items-center gap-1 rounded-xl bg-orange-500 px-3.5 font-heading text-xs font-semibold text-white hover:bg-orange-600"
                          >
                            <ChefHat className="h-3.5 w-3.5" />
                            <span>Start Cooking</span>
                          </LoadingButton>
                        )}

                      {order.fulfillmentStatus === "cooking" && (
                        <LoadingButton
                          type="button"
                          isLoading={isUpdating}
                          loadingText="Updating…"
                          onClick={() =>
                            handleUpdate(order._id, {
                              fulfillmentStatus: "on_the_way",
                            })
                          }
                          className="inline-flex h-9 items-center gap-1 rounded-xl bg-purple-600 px-3.5 font-heading text-xs font-semibold text-white hover:bg-purple-700"
                        >
                          <Bike className="h-3.5 w-3.5" />
                          <span>Out for Delivery</span>
                        </LoadingButton>
                      )}

                      {order.fulfillmentStatus === "on_the_way" && (
                        <LoadingButton
                          type="button"
                          isLoading={isUpdating}
                          loadingText="Updating…"
                          onClick={() =>
                            handleUpdate(order._id, {
                              fulfillmentStatus: "delivered",
                            })
                          }
                          className="inline-flex h-9 items-center gap-1 rounded-xl bg-emerald-600 px-3.5 font-heading text-xs font-semibold text-white hover:bg-emerald-700"
                        >
                          <PackageCheck className="h-3.5 w-3.5" />
                          <span>Mark Delivered</span>
                        </LoadingButton>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
