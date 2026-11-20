"use client"

import { useState } from "react"
import Link from "next/link"
import { Eye, Pencil, Trash2 } from "lucide-react"
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
import { deleteItem } from "@/lib/api/items"
import { toastSuccess, toastError } from "@/lib/toast"

interface Props {
  initialItems: MenuItemData[]
}

// Renders the vendor's menu item grid with details/edit/delete per card
const VendorMenuItemsGrid = ({ initialItems }: Props) => {
  const [items, setItems] = useState(initialItems)
  const [itemToDelete, setItemToDelete] = useState<MenuItemData | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Executes the delete API call and updates state upon confirmation
  const handleConfirmDelete = async () => {
    if (!itemToDelete) return

    setIsDeleting(true)
    try {
      await deleteItem(itemToDelete._id)
      // Optimistically remove the deleted item from the list
      setItems((prev) => prev.filter((i) => i._id !== itemToDelete._id))
      toastSuccess("Menu item deleted.")
      setItemToDelete(null)
    } catch (err) {
      toastError(
        "Failed to delete item.",
        err instanceof Error ? err.message : undefined
      )
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
              actions={
                // Vendor action footer: Details link, Edit link, and Delete button
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