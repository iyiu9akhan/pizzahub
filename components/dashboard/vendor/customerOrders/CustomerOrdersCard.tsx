"use client"

import React, { useMemo, useState } from "react"
import {
  Bike,
  Check,
  CheckCircle2,
  ChefHat,
  ClipboardList,
  Loader2,
  LockKeyhole,
  MapPin,
  PackageCheck,
  Pizza,
  X,
} from "lucide-react"
import { formatUSD } from "@/lib/format"
import UserAvatar from "@/components/ui/UserAvatar"

export type OrderStatus = "pending" | "accepted" | "rejected" | "cancelled"
export type FulfillmentStatus = "cooking" | "on_the_way" | "delivered"

// What the vendor can send to the server
export type OrderUpdate =
  | { status: "accepted" | "rejected" }
  | { fulfillmentStatus: FulfillmentStatus }

export interface OrderItem {
  itemName?: string
  name?: string
  quantity?: number
  price?: number
  image?: string
}

export interface VendorOrder {
  _id: string
  customerName: string
  customerEmail: string
  customerImage?: string
  customerPhone?: string
  deliveryAddress?: string
  deliveryDate?: string
  message?: string
  items: OrderItem[]
  totalAmount: number
  status: OrderStatus
  fulfillmentStatus?: FulfillmentStatus
  createdAt?: string
}

interface CustomerOrdersCardProps {
  orders: VendorOrder[]
  onUpdateStatus?: (id: string, update: OrderUpdate) => void | Promise<void>
}

// One display stage combines status + fulfillmentStatus
type Stage =
  | "pending"
  | "accepted"
  | "cooking"
  | "on_the_way"
  | "delivered"
  | "rejected"
  | "cancelled"

const getStage = (o: VendorOrder): Stage =>
  o.status === "accepted" ? (o.fulfillmentStatus ?? "accepted") : o.status

const STAGE_STYLES: Record<Stage, { label: string; cls: string }> = {
  pending: {
    label: "Pending",
    cls: "bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300",
  },
  accepted: {
    label: "Accepted",
    cls: "bg-sky-100 text-sky-800 dark:bg-sky-500/20 dark:text-sky-300",
  },
  cooking: {
    label: "Cooking",
    cls: "bg-orange-100 text-orange-800 dark:bg-orange-500/20 dark:text-orange-300",
  },
  on_the_way: {
    label: "On the way",
    cls: "bg-indigo-100 text-indigo-800 dark:bg-indigo-500/20 dark:text-indigo-300",
  },
  delivered: {
    label: "Delivered",
    cls: "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300",
  },
  rejected: {
    label: "Rejected",
    cls: "bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-300",
  },
  cancelled: {
    label: "Cancelled",
    cls: "bg-zinc-200 text-zinc-700 dark:bg-zinc-500/20 dark:text-zinc-300",
  },
}

// Progress steps shown after an order is accepted
const STEPS: { stage: Stage; label: string }[] = [
  { stage: "accepted", label: "Accepted" },
  { stage: "cooking", label: "Cooking" },
  { stage: "on_the_way", label: "On the way" },
  { stage: "delivered", label: "Delivered" },
]

// The next button for each stage
const NEXT_ACTION: Partial<
  Record<
    Stage,
    { label: string; update: OrderUpdate; icon: React.ElementType }
  >
> = {
  accepted: {
    label: "Start Cooking",
    update: { fulfillmentStatus: "cooking" },
    icon: ChefHat,
  },
  cooking: {
    label: "Out for Delivery",
    update: { fulfillmentStatus: "on_the_way" },
    icon: Bike,
  },
  on_the_way: {
    label: "Mark Delivered",
    update: { fulfillmentStatus: "delivered" },
    icon: PackageCheck,
  },
}

// Filter tabs group the stages
type FilterKey = "all" | "pending" | "progress" | "delivered" | "rejected" | "cancelled"

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "progress", label: "In progress" },
  { key: "delivered", label: "Delivered" },
  { key: "rejected", label: "Rejected" },
  { key: "cancelled", label: "Cancelled" },
]

const matchesFilter = (stage: Stage, key: FilterKey) => {
  if (key === "all") return true
  if (key === "progress")
    return stage === "accepted" || stage === "cooking" || stage === "on_the_way"
  return stage === key
}

// Format a date like "12 Mar 2026"
const formatDate = (value?: string) => {
  if (!value) return ""
  const d = new Date(value)
  if (isNaN(d.getTime())) return value
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

// Colored status pill
const StatusBadge = ({ stage }: { stage: Stage }) => (
  <span
    className={`inline-flex items-center rounded-full px-3 py-1 font-heading text-xs font-bold ${STAGE_STYLES[stage].cls}`}
  >
    {STAGE_STYLES[stage].label}
  </span>
)

// Small 4-step tracker (only for accepted orders)
const ProgressTracker = ({ stage }: { stage: Stage }) => {
  const current = STEPS.findIndex((s) => s.stage === stage)
  if (current < 0) return null
  return (
    <div className="mt-2.5 flex items-center" aria-label="Order progress">
      {STEPS.map((step, i) => (
        <React.Fragment key={step.stage}>
          <span
            title={step.label}
            className={`h-2.5 w-2.5 shrink-0 rounded-full ${
              i <= current ? "bg-brand" : "bg-line"
            }`}
          />
          {i < STEPS.length - 1 && (
            <span
              className={`h-0.5 w-6 ${i < current ? "bg-brand" : "bg-line"}`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  )
}

// Item image with a pizza icon fallback
const ItemThumb = ({ src, alt }: { src?: string; alt: string }) => (
  <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-brand-soft/50 text-brand-fg/60">
    {src ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt={alt} className="h-full w-full object-cover" />
    ) : (
      <Pizza className="h-5 w-5" />
    )}
  </div>
)

const CustomerOrdersCard = ({
  orders,
  onUpdateStatus,
}: CustomerOrdersCardProps) => {
  const [filter, setFilter] = useState<FilterKey>("all")
  // Remembers which order and button is loading
  const [busy, setBusy] = useState<{ id: string; key: string } | null>(null)

  // Count per filter tab
  const counts = useMemo(() => {
    const c: Record<string, number> = {}
    FILTERS.forEach((f) => {
      c[f.key] = orders.filter((o) => matchesFilter(getStage(o), f.key)).length
    })
    return c
  }, [orders])

  const visibleOrders = useMemo(
    () => orders.filter((o) => matchesFilter(getStage(o), filter)),
    [orders, filter]
  )

  // Send update to parent and show a spinner meanwhile
  const run = async (id: string, key: string, update: OrderUpdate) => {
    setBusy({ id, key })
    try {
      await onUpdateStatus?.(id, update)
    } finally {
      setBusy(null)
    }
  }

  // Action area changes with the order stage
  const renderActions = (order: VendorOrder) => {
    const stage = getStage(order)
    const isBusy = busy?.id === order._id

    // New order: accept or reject
    if (stage === "pending") {
      return (
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={isBusy}
            onClick={() => run(order._id, "accepted", { status: "accepted" })}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-brand px-3.5 py-2 font-heading text-xs font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isBusy && busy?.key === "accepted" ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Check className="h-3.5 w-3.5" />
            )}
            Accept
          </button>
          <button
            type="button"
            disabled={isBusy}
            onClick={() => run(order._id, "rejected", { status: "rejected" })}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-red-300 px-3.5 py-2 font-heading text-xs font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-red-500/40 dark:text-red-400 dark:hover:bg-red-500/10"
          >
            {isBusy && busy?.key === "rejected" ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <X className="h-3.5 w-3.5" />
            )}
            Reject
          </button>
        </div>
      )
    }

    // Accepted, cooking, on the way: one "next step" button
    const next = NEXT_ACTION[stage]
    if (next) {
      const Icon = next.icon
      return (
        <button
          type="button"
          disabled={isBusy}
          onClick={() => run(order._id, "next", next.update)}
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-brand px-4 py-2 font-heading text-xs font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isBusy ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Icon className="h-3.5 w-3.5" />
          )}
          {next.label}
        </button>
      )
    }

    // Finished orders
   if (stage === "delivered") {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 font-heading text-xs font-semibold text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-400">
      <CheckCircle2 className="h-4 w-3.5" />
      Completed
    </span>
  )
}

return (
  <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/50 px-3 py-1 font-heading text-xs font-medium text-muted-foreground">
    <LockKeyhole className="h-3.5 w-3.5" />
    Closed
  </span>
)
  }

  // Item cell: first item with image, plus "+N more"
  const renderItems = (order: VendorOrder) => {
    const first = order.items?.[0]
    const extra = (order.items?.length ?? 0) - 1
    const name = first?.itemName ?? first?.name ?? "Item"
    return (
      <div className="flex items-center gap-3">
        <ItemThumb src={first?.image} alt={name} />
        <div className="min-w-0">
          <p className="line-clamp-1 font-heading text-sm font-semibold text-ink">
            {name}
            <span className="font-text font-normal text-ink-muted">
              {" "}
              x{first?.quantity ?? 1}
            </span>
          </p>
          {extra > 0 && (
            <p className="font-text text-xs text-ink-muted">+{extra} more</p>
          )}
          {order.message && (
            <p
              title={order.message}
              className="line-clamp-1 font-text text-xs italic text-ink-muted"
            >
              &ldquo;{order.message}&rdquo;
            </p>
          )}
        </div>
      </div>
    )
  }

  // Customer cell with profile picture
  const renderCustomer = (order: VendorOrder) => (
    <div className="flex min-w-0 items-center gap-3">
      <UserAvatar
        src={order.customerImage}
        name={order.customerName}
        size="md"
      />
      <div className="min-w-0">
        <p className="truncate font-heading text-sm font-bold text-ink">
          {order.customerName}
        </p>
        <p className="truncate font-text text-xs text-ink-muted">
          {order.customerEmail}
        </p>
        {order.customerPhone && (
          <p className="font-text text-xs text-ink-muted">
            {order.customerPhone}
          </p>
        )}
      </div>
    </div>
  )

  return (
    <div className="w-full">
      {/* Filter tabs */}
      <div className="mb-5 flex gap-2 overflow-x-auto pb-1 scrollbar-none [&::-webkit-scrollbar]:hidden">
        {FILTERS.map((f) => {
          const active = filter === f.key
          return (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              className={`inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-full border px-4 py-2 font-heading text-sm font-semibold transition-colors ${
                active
                  ? "border-brand bg-brand text-white shadow-sm"
                  : "border-line bg-surface text-ink hover:bg-brand-soft/40"
              }`}
            >
              {f.label}
              <span
                className={`rounded-full px-2 py-0.5 text-[11px] ${
                  active ? "bg-white/20" : "bg-brand-soft text-brand-fg"
                }`}
              >
                {counts[f.key] ?? 0}
              </span>
            </button>
          )
        })}
      </div>

      {visibleOrders.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-line bg-surface py-16 text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-brand-soft text-brand-fg">
            <ClipboardList className="h-6 w-6" />
          </div>
          <p className="font-heading text-base font-semibold text-ink">
            No orders found
          </p>
          <p className="mt-1 text-sm text-ink-muted">
            Orders from customers will appear here.
          </p>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden overflow-hidden rounded-2xl border border-line bg-surface shadow-2xs lg:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-250 text-left">
                <thead className="border-b border-line bg-brand-soft/40">
                  <tr className="font-heading text-xs uppercase tracking-wide text-ink-muted">
                    <th className="px-5 py-3.5 font-semibold">Customer</th>
                    <th className="px-5 py-3.5 font-semibold">Item</th>
                    <th className="px-5 py-3.5 font-semibold">Delivery</th>
                    <th className="px-5 py-3.5 font-semibold">Total</th>
                    <th className="px-5 py-3.5 font-semibold">Status</th>
                    <th className="px-5 py-3.5 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {visibleOrders.map((order) => {
                    const stage = getStage(order)
                    return (
                      <tr
                        key={order._id}
                        className="transition-colors hover:bg-brand-soft/20"
                      >
                        <td className="px-5 py-4 align-middle">
                          {renderCustomer(order)}
                        </td>
                        <td className="max-w-60 px-5 py-4 align-middle">
                          {renderItems(order)}
                        </td>
                        <td className="max-w-55 px-5 py-4 align-middle">
                          <p className="font-text text-sm font-medium text-ink">
                            {formatDate(order.deliveryDate) || "Date not set"}
                          </p>
                          <p className="mt-0.5 flex items-start gap-1 font-text text-xs text-ink-muted">
                            <MapPin className="mt-0.5 h-3 w-3 shrink-0" />
                            <span className="line-clamp-2">
                              {order.deliveryAddress || "Address not provided"}
                            </span>
                          </p>
                        </td>
                        <td className="px-5 py-4 align-middle font-heading text-sm font-bold text-ink">
                          {formatUSD(order.totalAmount)}
                        </td>
                        <td className="px-5 py-4 align-middle">
                          <StatusBadge stage={stage} />
                          <ProgressTracker stage={stage} />
                        </td>
                        <td className="px-5 py-4 align-middle">
                          {renderActions(order)}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile and tablet cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:hidden">
            {visibleOrders.map((order) => {
              const stage = getStage(order)
              return (
                <article
                  key={order._id}
                  className="flex flex-col rounded-2xl border border-line bg-surface p-4 shadow-2xs"
                >
                  <div className="flex items-start justify-between gap-3">
                    {renderCustomer(order)}
                    <StatusBadge stage={stage} />
                  </div>

                  <div className="mt-3 space-y-3 border-t border-line pt-3">
                    {renderItems(order)}
                    <p className="flex items-start gap-1.5 font-text text-xs text-ink-muted">
                      <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                      <span>
                        {formatDate(order.deliveryDate) || "Date not set"} ·{" "}
                        {order.deliveryAddress || "Address not provided"}
                      </span>
                    </p>
                    <ProgressTracker stage={stage} />
                  </div>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-3">
                    <p className="font-heading text-base font-extrabold text-ink">
                      {formatUSD(order.totalAmount)}
                    </p>
                    {renderActions(order)}
                  </div>
                </article>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}

export default CustomerOrdersCard