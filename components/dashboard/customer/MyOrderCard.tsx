// MyOrderCard — displays a single customer order with status, items, total, and cancel action.
"use client"

import React, { useState } from "react"
import { formatBDT } from "@/lib/format"
import { CustomerOrder, OrderStatus, FulfillmentStatus } from "@/types/order"
import { cancelOrderAction } from "@/lib/actions/OrderStatus"
import { toastSuccess, toastError } from "@/lib/toast"
import LoadingButton from "@/components/ui/LoadingButton"
import {
  Clock,
  CheckCircle2,
  XCircle,
  ChefHat,
  Bike,
  PackageCheck,
  MapPin,
  Calendar,
  Store,
  Ban,
} from "lucide-react"

interface MyOrderCardProps {
  order: CustomerOrder
  onCancelled?: (orderId: string) => void
}

type Stage =
  | "pending"
  | "accepted"
  | "rejected"
  | "cancelled"
  | "cooking"
  | "on_the_way"
  | "delivered"

function getStage(
  status: OrderStatus,
  fulfillmentStatus?: FulfillmentStatus
): Stage {
  if (status === "rejected") return "rejected"
  if (status === "cancelled") return "cancelled"
  if (fulfillmentStatus === "delivered") return "delivered"
  if (fulfillmentStatus === "on_the_way") return "on_the_way"
  if (fulfillmentStatus === "cooking") return "cooking"
  if (status === "accepted") return "accepted"
  return "pending"
}

const STAGE_STYLES: Record<
  Stage,
  { label: string; icon: React.ReactNode; badge: string }
> = {
  pending: {
    label: "Pending",
    icon: <Clock className="h-3.5 w-3.5" />,
    badge: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  },
  accepted: {
    label: "Accepted",
    icon: <CheckCircle2 className="h-3.5 w-3.5" />,
    badge: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  },
  cooking: {
    label: "Preparing",
    icon: <ChefHat className="h-3.5 w-3.5" />,
    badge: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
  },
  on_the_way: {
    label: "On the Way",
    icon: <Bike className="h-3.5 w-3.5" />,
    badge: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  },
  delivered: {
    label: "Delivered",
    icon: <PackageCheck className="h-3.5 w-3.5" />,
    badge: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  },
  rejected: {
    label: "Rejected",
    icon: <XCircle className="h-3.5 w-3.5" />,
    badge: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  },
  cancelled: {
    label: "Cancelled",
    icon: <XCircle className="h-3.5 w-3.5" />,
    badge: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
  },
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return "—"
  try {
    return new Date(dateStr).toLocaleDateString("en-BD", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  } catch {
    return dateStr
  }
}

const MyOrderCard: React.FC<MyOrderCardProps> = ({ order, onCancelled }) => {
  const [isCancelling, setIsCancelling] = useState(false)
  const [currentStatus, setCurrentStatus] = useState<OrderStatus>(order.status)

  const stage = getStage(currentStatus, order.fulfillmentStatus)
  const stageStyle = STAGE_STYLES[stage]

  const firstItem = order.items?.[0]
  const thumbnail = firstItem?.image

  const handleCancel = async () => {
    setIsCancelling(true)
    try {
      const res = await cancelOrderAction(order._id)
      if (res.success) {
        setCurrentStatus("cancelled")
        toastSuccess("Order cancelled.")
        onCancelled?.(order._id)
      } else {
        toastError("Cancel failed", res.message || "Failed to cancel order.")
      }
    } catch {
      toastError("Cancel failed", "Unexpected error.")
    } finally {
      setIsCancelling(false)
    }
  }

  return (
    <div className="rounded-2xl border border-line bg-surface p-4 shadow-xs transition-shadow hover:shadow-md">
      {/* Top row: thumbnail + summary */}
      <div className="flex gap-4">
        {/* Item thumbnail */}
        <div className="shrink-0">
          {thumbnail ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={thumbnail}
              alt={firstItem?.itemName || firstItem?.name || "Order item"}
              className="h-20 w-20 rounded-xl object-cover"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-brand-soft text-brand-fg text-2xl font-heading font-bold">
              🍕
            </div>
          )}
        </div>

        {/* Order info */}
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          {/* Item names */}
          <p className="font-heading text-sm font-semibold text-ink line-clamp-2">
            {order.items
              .map((i) => i.itemName || i.name || "Item")
              .join(", ")}
          </p>

          {/* Item count */}
          <p className="text-xs text-ink-muted">
            {order.items.length} item{order.items.length !== 1 ? "s" : ""}
            {order.items[0]?.quantity && order.items.length === 1
              ? ` × ${order.items[0].quantity}`
              : ""}
          </p>

          {/* Status badge */}
          <span
            className={`mt-1 inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${stageStyle.badge}`}
          >
            {stageStyle.icon}
            {stageStyle.label}
          </span>
        </div>

        {/* Total amount + cancel button */}
        <div className="shrink-0 flex flex-col items-end justify-between">
          <p className="font-heading text-base font-bold text-ink">
            {formatBDT(order.totalAmount)}
          </p>

          {/* Cancel button: only visible when order is pending */}
          {currentStatus === "pending" && (
            <LoadingButton
              type="button"
              isLoading={isCancelling}
              loadingText="Cancelling…"
              onClick={handleCancel}
              className="mt-2 inline-flex items-center gap-1 rounded-lg border border-red-300 bg-surface px-2.5 py-1 font-heading text-xs font-semibold text-red-600 hover:bg-red-50 dark:border-red-500/30 dark:text-red-400 dark:hover:bg-red-500/10 cursor-pointer"
            >
              <Ban className="h-3 w-3" />
              <span>Cancel</span>
            </LoadingButton>
          )}
        </div>
      </div>

      {/* Bottom row: vendor, delivery address + date */}
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-line pt-3 text-xs text-ink-muted">
        {order.vendorName && (
          <span className="flex items-center gap-1 font-medium text-ink">
            <Store className="h-3 w-3 shrink-0 text-brand-fg" />
            <span>{order.vendorName}</span>
          </span>
        )}
        {order.deliveryAddress && (
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3 shrink-0" />
            <span className="line-clamp-1">{order.deliveryAddress}</span>
          </span>
        )}
        <span className="flex items-center gap-1 ml-auto">
          <Calendar className="h-3 w-3 shrink-0" />
          {formatDate(order.createdAt)}
        </span>
      </div>
    </div>
  )
}

export default MyOrderCard
