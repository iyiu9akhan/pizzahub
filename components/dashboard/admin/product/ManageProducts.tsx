"use client"

import React, { useState, useMemo } from "react"
import Link from "next/link"
import {
  Ban,
  Check,
  Eye,
  Pizza,
  RotateCcw,
  Search,
  Trash2,
  X,
} from "lucide-react"
import { MenuItemData, MenuItemStatus } from "@/components/menu/MenuItemCard"
import { formatUSD } from "@/lib/format"
import { updateItemStatus, deleteItem } from "@/lib/actions/ItemActions"
import { toastSuccess, toastError } from "@/lib/toast"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog"
import LoadingButton from "@/components/ui/LoadingButton"
import { Badge } from "@/components/ui/badge"

interface ManageProductsProps {
  initialItems: MenuItemData[]
}

const STATUS_BADGES: Record<MenuItemStatus, { label: string; cls: string }> = {
  pending: {
    label: "Pending",
    cls: "bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300",
  },
  approved: {
    label: "Approved",
    cls: "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300",
  },
  rejected: {
    label: "Rejected",
    cls: "bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-300",
  },
  inactive: {
    label: "Inactive",
    cls: "bg-zinc-200 text-zinc-700 dark:bg-zinc-500/20 dark:text-zinc-300",
  },
}

/* ------------------------------------------------------------------ */
/* Icon action buttons (one place for the shared look)                  */
/* ------------------------------------------------------------------ */

type ActionTone = "neutral" | "success" | "danger" | "warning"

const ACTION_BASE =
  "flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border transition-colors disabled:opacity-40"

const ACTION_TONES: Record<ActionTone, string> = {
  neutral: "border-line text-ink hover:bg-brand-soft",
  success:
    "border-emerald-300 text-emerald-600 hover:bg-emerald-50 dark:border-emerald-500/40 dark:text-emerald-400 dark:hover:bg-emerald-500/10",
  danger:
    "border-red-300 text-red-600 hover:bg-red-50 dark:border-red-500/40 dark:text-red-400 dark:hover:bg-red-500/10",
  warning:
    "border-amber-300 text-amber-600 hover:bg-amber-50 dark:border-amber-500/40 dark:text-amber-400 dark:hover:bg-amber-500/10",
}

interface ActionButtonProps {
  title: string
  tone: ActionTone
  onClick: () => void
  disabled?: boolean
  children: React.ReactNode
}

function ActionButton({
  title,
  tone,
  onClick,
  disabled,
  children,
}: ActionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-label={title}
      className={`${ACTION_BASE} ${ACTION_TONES[tone]}`}
    >
      {children}
    </button>
  )
}

interface ActionLinkProps {
  href: string
  title: string
  children: React.ReactNode
}

function ActionLink({ href, title, children }: ActionLinkProps) {
  return (
    <Link
      href={href}
      title={title}
      aria-label={title}
      className={`${ACTION_BASE} ${ACTION_TONES.neutral}`}
    >
      {children}
    </Link>
  )
}

export default function ManageProducts({ initialItems }: ManageProductsProps) {
  const [items, setItems] = useState<MenuItemData[]>(initialItems)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [itemToDelete, setItemToDelete] = useState<MenuItemData | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [actionId, setActionId] = useState<string | null>(null)
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({})

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        item.itemName.toLowerCase().includes(search.toLowerCase()) ||
        item.category.toLowerCase().includes(search.toLowerCase()) ||
        (item.vendorName?.toLowerCase() || "").includes(search.toLowerCase())
      const itemStatus = item.status || "pending"
      const matchesStatus =
        statusFilter === "all" || itemStatus === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [items, search, statusFilter])

  const handleStatusChange = async (id: string, status: MenuItemStatus) => {
    setActionId(id)

    try {
      const res = await updateItemStatus(id, status)

      if (res.success) {
        setItems((prev) =>
          prev.map((i) => (i._id === id ? { ...i, status } : i))
        )

        toastSuccess(`Item marked as ${status}.`)
      } else {
        toastError("Status update failed", res.message)
      }
    } catch {
      toastError("Status update failed", "Unexpected error.")
    } finally {
      setActionId(null)
    }
  }

  const handleDelete = async () => {
    if (!itemToDelete) return
    setIsDeleting(true)
    try {
      const res = await deleteItem(itemToDelete._id)
      if (res.success) {
        setItems((prev) => prev.filter((i) => i._id !== itemToDelete._id))
        toastSuccess("Menu item deleted.")
        setItemToDelete(null)
      } else {
        toastError("Delete failed", res.message)
      }
    } catch {
      toastError("Delete failed", "Unexpected error.")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="w-full space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div>
        <h1 className="font-heading text-2xl font-bold text-ink sm:text-3xl">
          Manage Products
        </h1>
        <p className="mt-1 font-text text-sm text-ink-muted">
          Review, approve, or remove all vendor menu items.
        </p>
      </div>

      {/* Filters Toolbar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-line bg-surface p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-ink-muted" />
          <input
            type="text"
            placeholder="Search item, category, vendor…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-line bg-surface py-2 pr-3.5 pl-9 font-text text-sm text-ink placeholder:text-ink-muted focus:border-brand focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto">
          {["all", "pending", "approved", "rejected"].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setStatusFilter(tab)}
              className={`rounded-xl px-3.5 py-1.5 font-heading text-xs font-semibold capitalize transition-colors ${
                statusFilter === tab
                  ? "bg-brand text-white"
                  : "border border-line bg-surface text-ink hover:bg-brand-soft"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Products Table */}
      <div className="overflow-hidden rounded-2xl border border-line bg-surface">
        <div className="overflow-x-auto">
          <table className="w-full min-w-160 text-left">
            <thead>
              <tr className="border-b border-line bg-brand-soft/40 font-heading text-xs tracking-wider text-ink-muted uppercase">
                <th className="px-5 py-3.5">Item</th>
                <th className="px-4 py-3.5">Category</th>
                <th className="px-4 py-3.5">Price</th>
                <th className="px-4 py-3.5">Vendor</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {filteredItems.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="py-12 text-center text-sm text-ink-muted"
                  >
                    No products match the selected criteria.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => {
                  const statusKey = (item.status as MenuItemStatus) || "pending"
                  const badge =
                    STATUS_BADGES[statusKey] || STATUS_BADGES.pending
                  const isUpdating = actionId === item._id

                  return (
                    <tr
                      key={item._id}
                      className="transition-colors hover:bg-muted/30"
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl border border-line bg-brand-soft/40">
                            {item.images?.[0] && !failedImages[item._id] ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={item.images[0]}
                                alt={item.itemName}
                                onError={() =>
                                  setFailedImages((prev) => ({
                                    ...prev,
                                    [item._id]: true,
                                  }))
                                }
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-brand-fg/50">
                                <Pizza className="h-5 w-5" />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-heading text-sm font-semibold text-ink">
                              {item.itemName}
                            </p>
                            <p className="font-text text-xs text-ink-muted">
                              {item.location}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 font-text text-xs text-ink">
                        {item.category}
                      </td>
                      <td className="px-4 py-3.5 font-heading text-sm font-bold text-brand-fg">
                        {formatUSD(item.price)}
                      </td>
                      <td className="px-4 py-3.5 font-text text-xs text-ink-muted">
                        {item.vendorName || "—"}
                      </td>
                      <td className="px-4 py-3.5">
                        <Badge
                          variant="secondary"
                          className={`rounded-full font-heading text-[11px] font-bold ${badge.cls}`}
                        >
                          {badge.label}
                        </Badge>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        {/*
                          Admin actions: review (approve / reject), change the
                          status of published items, and delete. Admins do not
                          edit item content (that belongs to the vendor).
                        */}
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View public page */}
                          {(statusKey === "approved" ||
                            statusKey === "inactive") && (
                            <ActionLink
                              href={`/menu/${item._id}`}
                              title="View public details"
                            >
                              <Eye className="h-4 w-4" />
                            </ActionLink>
                          )}

                          {/* Pending: approve or reject */}
                          {statusKey === "pending" && (
                            <>
                              <ActionButton
                                title="Approve item"
                                tone="success"
                                disabled={isUpdating}
                                onClick={() =>
                                  handleStatusChange(item._id, "approved")
                                }
                              >
                                <Check className="h-4 w-4" />
                              </ActionButton>

                              <ActionButton
                                title="Reject item"
                                tone="danger"
                                disabled={isUpdating}
                                onClick={() =>
                                  handleStatusChange(item._id, "rejected")
                                }
                              >
                                <X className="h-4 w-4" />
                              </ActionButton>
                            </>
                          )}

                          {/* Approved: ban (reject) a published item */}
                          {statusKey === "approved" && (
                            <ActionButton
                              title="Ban item"
                              tone="warning"
                              disabled={isUpdating}
                              onClick={() =>
                                handleStatusChange(item._id, "rejected")
                              }
                            >
                              <Ban className="h-4 w-4" />
                            </ActionButton>
                          )}

                          {/* Inactive / Rejected: restore to approved */}
                          {(statusKey === "inactive" ||
                            statusKey === "rejected") && (
                            <ActionButton
                              title={
                                statusKey === "rejected"
                                  ? "Restore item"
                                  : "Reactivate item"
                              }
                              tone="success"
                              disabled={isUpdating}
                              onClick={() =>
                                handleStatusChange(item._id, "approved")
                              }
                            >
                              <RotateCcw className="h-4 w-4" />
                            </ActionButton>
                          )}

                          {/* Delete: any status */}
                          <ActionButton
                            title="Delete item"
                            tone="danger"
                            disabled={isUpdating}
                            onClick={() => setItemToDelete(item)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </ActionButton>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog
        open={Boolean(itemToDelete)}
        onOpenChange={(open) => {
          if (!isDeleting && !open) setItemToDelete(null)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete menu item?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &ldquo;{itemToDelete?.itemName}
              &rdquo;? This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <LoadingButton
              type="button"
              isLoading={isDeleting}
              loadingText="Deleting…"
              onClick={handleDelete}
              className="inline-flex h-10 cursor-pointer items-center justify-center rounded-xl bg-red-600 px-5 font-heading text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-60"
            >
              Delete
            </LoadingButton>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}