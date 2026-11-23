"use client"

import { useState } from "react"
import Link from "next/link"
import {
  CheckCircle2,
  Clock,
  Eye,
  Loader2,
  PauseCircle,
  Pencil,
  Power,
  PowerOff,
  Trash2,
  XCircle,
} from "lucide-react"
import MenuItemCard, { MenuItemData } from "@/components/menu/MenuItemCard"
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
import { deleteItem, toggleItemAvailability } from "@/lib/actions/ItemActions"
import { toastSuccess, toastError } from "@/lib/toast"

interface Props {
  initialItems: MenuItemData[]
}

// Status display config: label, helper text, icon and colors (light + dark mode)
// TODO(admin): update the wording here when the admin approval flow is built
const STATUS_CONFIG = {
  pending: {
    label: "Pending Review",
    hint: "Waiting for admin approval. Not visible to customers yet.",
    Icon: Clock,
    box: "border-amber-300/70 bg-amber-50 dark:border-amber-500/30 dark:bg-amber-500/10",
    iconBox: "bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400",
    title: "text-amber-700 dark:text-amber-400",
  },
  approved: {
    label: "Approved",
    hint: "Live on the menu. Customers can order this item.",
    Icon: CheckCircle2,
    box: "border-emerald-300/70 bg-emerald-50 dark:border-emerald-500/30 dark:bg-emerald-500/10",
    iconBox: "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400",
    title: "text-emerald-700 dark:text-emerald-400",
  },
  rejected: {
    label: "Rejected",
    hint: "This item was not approved. Edit it and try again.",
    Icon: XCircle,
    box: "border-red-300/70 bg-red-50 dark:border-red-500/30 dark:bg-red-500/10",
    iconBox: "bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400",
    title: "text-red-700 dark:text-red-400",
  },
  inactive: {
    label: "Inactive",
    hint: "Deactivated. Not visible to customers or orderable.",
    Icon: PauseCircle,
    box: "border-zinc-300/70 bg-zinc-50 dark:border-zinc-500/30 dark:bg-zinc-500/10",
    iconBox: "bg-zinc-200 text-zinc-600 dark:bg-zinc-500/20 dark:text-zinc-400",
    title: "text-zinc-700 dark:text-zinc-300",
  },
} as const

// Small status panel shown above the action buttons on each card
const StatusPanel = ({ status }: { status?: string }) => {
  // Missing or unknown status falls back to "pending"
  const key =
    status === "approved" || status === "rejected" || status === "inactive"
      ? status
      : "pending"
  const { label, hint, Icon, box, iconBox, title } = STATUS_CONFIG[key]

  return (
    <div className={`flex items-start gap-3 rounded-xl border px-3 py-2.5 ${box}`}>
      <span
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${iconBox}`}
      >
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0">
        <p className={`font-heading text-sm font-semibold leading-tight ${title}`}>
          {label}
        </p>
        <p className="mt-0.5 text-xs leading-snug text-ink-muted">{hint}</p>
      </div>
    </div>
  )
}

// Renders the vendor's menu item grid with details/edit/delete per card
const VendorMenuItemsGrid = ({ initialItems }: Props) => {
  const [items, setItems] = useState(initialItems)
  const [itemToDelete, setItemToDelete] = useState<MenuItemData | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [togglingId, setTogglingId] = useState<string | null>(null)

  const handleToggleAvailability = async (item: MenuItemData) => {
    const nextStatus = item.status === "approved" ? "inactive" : "approved"
    setTogglingId(item._id)
    try {
      const res = await toggleItemAvailability(item._id, nextStatus)
      if (res.success) {
        setItems((prev) =>
          prev.map((i) => (i._id === item._id ? { ...i, status: nextStatus } : i))
        )
        toastSuccess(
          nextStatus === "approved"
            ? "Item activated and live on menu."
            : "Item deactivated."
        )
      } else {
        toastError("Failed to update status", res.message)
      }
    } catch {
      toastError("Failed to update status", "An unexpected error occurred.")
    } finally {
      setTogglingId(null)
    }
  }

  // Executes the delete action and updates state upon confirmation
  const handleConfirmDelete = async () => {
    if (!itemToDelete) return

    setIsDeleting(true)
    try {
      const res = await deleteItem(itemToDelete._id)
      if (!res.success) {
        toastError("Failed to delete item.", res.message)
        return
      }
      // Optimistically remove the deleted item from the list
      setItems((prev) => prev.filter((i) => i._id !== itemToDelete._id))
      toastSuccess("Menu item deleted.")
      setItemToDelete(null)
    } catch {
      toastError("Failed to delete item.", "An unexpected error occurred.")
    } finally {
      setIsDeleting(false)
    }
  }

  // Render empty state when vendor has no items
  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-line py-16 text-center">
        <p className="font-heading text-base font-semibold text-ink">
          No menu items yet
        </p>
        <p className="mt-1 text-sm text-ink-muted">
          Add your first item to see it here.
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {items.map((item) => {
          const isCurrentDeleting = isDeleting && itemToDelete?._id === item._id

          return (
            <MenuItemCard
              key={item._id}
              item={item}
              status={item.status}
              showFavorite={false}
              actions={
                // Vendor footer: status panel + Activate/Deactivate + Details, Edit, Delete
                <div className="flex flex-col gap-3">
                  <StatusPanel status={item.status} />

                  {(item.status === "approved" || item.status === "inactive") && (
                    <button
                      type="button"
                      onClick={() => handleToggleAvailability(item)}
                      disabled={togglingId === item._id}
                      className={`inline-flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-full border px-3 py-2 font-heading text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${item.status === "approved"
                        ? "border-amber-300/80 bg-amber-50 text-amber-700 hover:bg-amber-100 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-400"
                        : "border-emerald-300/80 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-400"
                        }`}
                    >
                      {togglingId === item._id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : item.status === "approved" ? (
                        <PowerOff className="h-3.5 w-3.5" />
                      ) : (
                        <Power className="h-3.5 w-3.5" />
                      )}
                      <span>
                        {item.status === "approved"
                          ? "Deactivate item"
                          : "Activate item"}
                      </span>
                    </button>
                  )}

                  <div className="flex items-center gap-2">
                    {/* Details button — links to public menu item details route */}
                    <Link
                      href={`/menu/${item._id}`}
                      className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full border border-line bg-surface px-3 py-2.5 font-heading text-xs font-semibold text-ink transition-colors hover:border-brand/50 hover:bg-brand/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 sm:text-sm"
                    >
                      <Eye className="h-4 w-4" />
                      <span>Details</span>
                    </Link>

                    {/* Edit button — links to item edit route */}
                    <Link
                      href={`/dashboard/vendor/menu-items/${item._id}/edit`}
                      className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-brand px-3 py-2.5 font-heading text-xs font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 sm:text-sm"
                    >
                      <Pencil className="h-4 w-4" />
                      <span>Edit</span>
                    </Link>

                    {/* Trigger for the delete confirmation dialog */}
                    <button
                      type="button"
                      onClick={() => setItemToDelete(item)}
                      disabled={isCurrentDeleting}
                      aria-label={`Delete ${item.itemName}`}
                      title="Delete"
                      className="inline-flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-red-300 text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-500/40 dark:text-red-400 dark:hover:bg-red-500/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              }
            />
          )
        })}
      </div>

      {/* Single controlled ShadCN AlertDialog for deletion confirmation */}
      <AlertDialog
        open={Boolean(itemToDelete)}
        onOpenChange={(open) => {
          if (!isDeleting && !open) {
            setItemToDelete(null)
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete menu item?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold text-ink">
                &ldquo;{itemToDelete?.itemName}&rdquo;
              </span>
              ? This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            {/* Confirm button with loading spinner */}
            <LoadingButton
              type="button"
              isLoading={isDeleting}
              loadingText="Deleting…"
              onClick={handleConfirmDelete}
              className="inline-flex h-10 cursor-pointer items-center justify-center rounded-xl bg-red-600 px-5 font-heading text-sm font-semibold text-white transition-colors hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/40 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Delete
            </LoadingButton>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export default VendorMenuItemsGrid