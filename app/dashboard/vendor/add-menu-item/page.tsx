// Add Menu Item page: /dashboard/vendor/add-menu-item
// Checks the free item limit, then uploads images and POSTs to the API.
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { PackagePlus, Clock } from "lucide-react"
import AddMenuItemForm from "@/components/dashboard/vendor/addMenuItemForm/AddMenuItemForm"
import { AddMenuItemFormValues } from "@/types/AddMenuItemDataType"
import { createItem } from "@/lib/actions/CreateItem"
import { getItemCount } from "@/lib/api/items"
import { getPremiumVendorById } from "@/lib/api/users"
import { toastSuccess, toastError } from "@/lib/toast"
import { useSession } from "@/lib/auth-client"
import LimitReachedCard from "@/components/dashboard/vendor/addMenuItemForm/LimitReachedCard"

// Free plan allows only 3 items
const FREE_LIMIT = 3

export default function AddMenuItemPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [isSubmitting, setIsSubmitting] = useState(false)
  // null means the count is still loading
  const [itemCount, setItemCount] = useState<number | null>(null)
  const [isPremium, setIsPremium] = useState<boolean>(false)

  const vendorId = session?.user?.id

  // Load how many items this vendor already created and premium status
  useEffect(() => {
    if (!vendorId) return
    Promise.all([
      getItemCount({ vendorId }).catch(() => 0),
      getPremiumVendorById(vendorId).catch(() => ({ isVendor: false, premium: false })),
    ]).then(([count, vendorData]) => {
      setItemCount(count)
      setIsPremium(Boolean(vendorData.isVendor && vendorData.premium))
    })
  }, [vendorId])

  // Upload images then create the item
  const handleCreate = async (values: AddMenuItemFormValues) => {
    setIsSubmitting(true)
    try {
      await createItem({
        ...values,
        vendorId,
        vendorName:
          (session?.user as { businessName?: string } | undefined)?.businessName ||
          session?.user?.name ||
          "Vendor",
        status: "pending",
      })
      toastSuccess("Menu item added. Waiting for admin approval.")
      router.push("/dashboard/vendor/menu-items")
      router.refresh()
    } catch (err) {
      const message = err instanceof Error ? err.message : ""

      // Server blocked the request because the free limit is reached
      if (message.includes("LIMIT_REACHED")) {
        toastError("Free limit reached", "Upgrade to Premium to add more items.")
        router.push("/dashboard/vendor/subscription?reason=limit")
        return
      }

      toastError("Failed to add menu item.", message || undefined)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Premium vendors have unlimited items; free vendors capped at 3
  const limitReached = !isPremium && itemCount !== null && itemCount >= FREE_LIMIT

  return (
    <div className="w-full p-4 sm:p-6 lg:p-8">
      {/* Page header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand text-white shadow-lg shadow-brand/25">
            <PackagePlus className="h-6 w-6" />
          </span>
          <div>
            <h1 className="font-heading text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
              Add menu item
            </h1>
            <p className="mt-1 font-text text-sm text-ink-muted">
              Create a new item for your restaurant menu.
            </p>
          </div>
        </div>

        {/* Usage badge or admin review notice */}
        <div className="inline-flex items-center gap-2 self-start rounded-full border border-line bg-surface px-4 py-2 font-text text-xs text-ink-muted sm:self-auto">
          <Clock className="h-4 w-4 text-brand-fg" />
          {isPremium
            ? "Unlimited items (Premium Vendor)"
            : itemCount !== null
            ? `${Math.min(itemCount, FREE_LIMIT)} / ${FREE_LIMIT} free items used`
            : "Reviewed by an admin before it goes live"}
        </div>
      </div>

      {/* Loading state while count is fetched */}
      {itemCount === null ? (
        <div className="h-96 animate-pulse rounded-2xl border border-line bg-brand-soft/30" />
      ) : limitReached ? (
        // Limit reached: show the upgrade card instead of the form
        <LimitReachedCard limit={FREE_LIMIT} used={itemCount} />
      ) : (
        <AddMenuItemForm
          mode="create"
          onSubmit={handleCreate}
          onCancel={() => router.push("/dashboard/vendor/menu-items")}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  )
}