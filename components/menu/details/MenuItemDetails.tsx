"use client"

import React, { useState, useSyncExternalStore } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { z } from "zod"
import {
  MapPin,
  Store,
  ArrowLeft,
  ShoppingBag,
  Info,
  Pizza,
  CheckCircle2,
  Star,
  Plus,
  Minus,
  Heart,
  Crown,
} from "lucide-react"

const orderFormSchema = z.object({
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
  deliveryAddress: z
    .string()
    .trim()
    .min(5, "Please enter a complete delivery address (at least 5 characters)"),
  customerPhone: z
    .string()
    .trim()
    .min(8, "Please enter a valid phone number (at least 8 digits)"),
})

import { useSession } from "@/lib/auth-client"
import { formatBDT } from "@/lib/format"
import { OrderPizza } from "@/lib/actions/OrderPizza"
import { toastSuccess, toastError, toastInfo } from "@/lib/toast"
import {
  addToWishlistAction,
  removeFromWishlistAction,
} from "@/lib/actions/WishlistActions"
import LoadingButton from "@/components/ui/LoadingButton"
import ItemReviewsSection, {
  ReviewItem,
} from "@/components/menu/details/ItemReviewsSection"
import type { MenuItem } from "@/types/menu"

const emptySubscribe = () => () => {}

export interface MenuItemDetailsProps {
  item: MenuItem
  reviews?: ReviewItem[]
  isFavorite?: boolean
}

export default function MenuItemDetails({
  item,
  reviews = [],
  isFavorite = false,
}: MenuItemDetailsProps) {
  const router = useRouter()
  const { data: session, isPending } = useSession()

  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [deliveryAddress, setDeliveryAddress] = useState("")
  const [customerPhone, setCustomerPhone] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderErrors, setOrderErrors] = useState<{
    deliveryAddress?: string
    customerPhone?: string
  }>({})

  // Wishlist state
  const [isWishlisted, setIsWishlisted] = useState<boolean>(isFavorite)
  const [isWishlistLoading, setIsWishlistLoading] = useState<boolean>(false)

  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false)

  const role =
    (session?.user as { role?: string } | undefined)?.role || "customer"

  const images = item.images && item.images.length > 0 ? item.images : []
  const activeImage = images[activeImageIndex]

  const handleToggleWishlist = async () => {
    if (!session?.user) {
      toastInfo("Please sign in as a customer to save items to your wishlist.")
      return
    }

    if (role !== "customer") {
      toastInfo("Only customer accounts can use the wishlist.")
      return
    }

    const nextState = !isWishlisted
    setIsWishlisted(nextState)
    setIsWishlistLoading(true)

    try {
      const res = nextState
        ? await addToWishlistAction(item._id)
        : await removeFromWishlistAction(item._id)

      if (res.success) {
        toastSuccess(nextState ? "Added to wishlist" : "Removed from wishlist")
      } else {
        setIsWishlisted(!nextState)
        toastError("Wishlist update failed", res.message || "Could not update wishlist.")
      }
    } catch {
      setIsWishlisted(!nextState)
      toastError("Wishlist update failed", "An error occurred while updating wishlist.")
    } finally {
      setIsWishlistLoading(false)
    }
  }

  const handleOrder = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!session?.user) {
      router.push(`/login?callbackUrl=${encodeURIComponent(`/menu/${item._id}`)}`)
      return
    }

    const validation = orderFormSchema.safeParse({
      quantity,
      deliveryAddress: deliveryAddress.trim(),
      customerPhone: customerPhone.trim(),
    })

    if (!validation.success) {
      const fieldErrors = validation.error.flatten().fieldErrors
      setOrderErrors({
        deliveryAddress: fieldErrors.deliveryAddress?.[0],
        customerPhone: fieldErrors.customerPhone?.[0],
      })
      return
    }

    setOrderErrors({})
    setIsSubmitting(true)
    try {
      const res = await OrderPizza({
        items: [{ itemId: item._id, quantity }],
        deliveryAddress: deliveryAddress.trim(),
        customerPhone: customerPhone.trim(),
      })

      if (res.success) {
        toastSuccess("Order placed successfully!", "You can track your order status in My Orders.")
        router.push("/dashboard/customer/my-orders")
        router.refresh()
      } else {
        toastError("Order failed", res.message || "Failed to place order.")
      }
    } catch {
      toastError("Order failed", "An unexpected error occurred.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 lg:py-16">
      {/* Back to menu button */}
      <Link
        href="/menu"
        className="mb-8 inline-flex items-center gap-2 font-heading text-sm font-semibold text-ink-muted transition-colors hover:text-brand-fg"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Menu</span>
      </Link>

      <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Left column: Image gallery */}
        <div className="flex flex-col gap-4">
          <div className="relative aspect-4/3 w-full overflow-hidden rounded-3xl border border-line bg-surface shadow-md">
            {activeImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={activeImage}
                alt={item.itemName}
                className="h-full w-full object-cover transition-all duration-300"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-brand-fg/40">
                <Pizza className="h-20 w-20" />
              </div>
            )}

            {/* Category tag on image */}
            <span className="absolute bottom-4 left-4 rounded-full bg-surface/90 px-4 py-1.5 font-heading text-xs font-bold text-brand-fg shadow-sm backdrop-blur-xs">
              {item.category}
            </span>

            {/* Heart toggle on image */}
            <button
              type="button"
              onClick={handleToggleWishlist}
              disabled={isWishlistLoading}
              aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
              className="absolute right-4 top-4 z-10 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-surface/90 shadow-md backdrop-blur-xs transition-transform hover:scale-110 active:scale-95 focus-visible:outline-none"
            >
              <Heart
                className={`h-5 w-5 transition-colors ${
                  isWishlisted
                    ? "fill-red-500 text-red-500"
                    : "text-ink-muted hover:text-red-500"
                }`}
              />
            </button>
          </div>

          {/* Thumbnail gallery */}
          {images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative h-20 w-20 shrink-0 cursor-pointer overflow-hidden rounded-2xl border-2 transition-all ${
                    activeImageIndex === idx
                      ? "scale-105 border-brand shadow-sm"
                      : "border-line opacity-70 hover:opacity-100"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img}
                    alt={`${item.itemName} view ${idx + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right column: Item metadata & Order form */}
        <div className="flex flex-col gap-6">
          <div>
            <div className="flex items-center justify-between">
              <span className="font-text text-xs font-bold uppercase tracking-widest text-brand-fg">
                {item.category}
              </span>

              {/* Rating stars */}
              <div className="flex items-center gap-1.5 text-sm text-amber-500">
                <Star className="h-4 w-4 fill-current" />
                <span className="font-heading font-bold text-ink">
                  {typeof item.ratingAvg === "number" && item.ratingAvg > 0
                    ? item.ratingAvg.toFixed(1)
                    : "New"}
                </span>
                {typeof item.ratingCount === "number" && item.ratingCount > 0 && (
                  <span className="font-text text-xs text-ink-muted">
                    ({item.ratingCount} reviews)
                  </span>
                )}
              </div>
            </div>

            <h1 className="mt-1 font-heading text-3xl font-extrabold text-ink sm:text-4xl">
              {item.itemName}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-4">
              <span className="font-heading text-3xl font-extrabold text-brand-fg">
                {formatBDT(item.price)}
              </span>

              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Freshly Baked
              </span>

              {/* Wishlist toggle chip */}
              <button
                type="button"
                onClick={handleToggleWishlist}
                disabled={isWishlistLoading}
                className={`inline-flex items-center gap-2 rounded-xl border px-3.5 py-1.5 font-heading text-xs font-semibold shadow-2xs transition-all hover:scale-105 active:scale-95 cursor-pointer ${
                  isWishlisted
                    ? "border-red-200 bg-red-50 text-red-600 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-400"
                    : "border-line bg-surface text-ink hover:text-red-500"
                }`}
              >
                <Heart
                  className={`h-4 w-4 ${isWishlisted ? "fill-current" : ""}`}
                />
                <span>{isWishlisted ? "Saved in Wishlist" : "Save to Wishlist"}</span>
              </button>
            </div>
          </div>

          {/* Description */}
          <div className="border-t border-line pt-4">
            <h2 className="font-heading text-sm font-bold text-ink">
              Description
            </h2>
            <p className="mt-2 font-text text-base leading-relaxed text-ink-muted">
              {item.description || "No specific description provided for this menu item."}
            </p>
          </div>

          {/* Location and vendor */}
          <div className="flex flex-col gap-3 rounded-2xl border border-line bg-surface p-4">
            <div className="flex items-center gap-3 font-text text-sm text-ink">
              <MapPin className="h-4 w-4 shrink-0 text-brand-fg" />
              <span>
                Location: <strong className="font-semibold">{item.location}</strong>
              </span>
            </div>

            {item.vendorName && (
              <div className="flex flex-wrap items-center gap-3 font-text text-sm text-ink">
                <div className="flex items-center gap-2">
                  <Store className="h-4 w-4 shrink-0 text-brand-fg" />
                  <span>
                    Prepared by: <strong className="font-semibold">{item.vendorName}</strong>
                  </span>
                </div>
                {item.isPremiumVendor && (
                  <span className="flex items-center gap-1 rounded-full bg-amber-400 px-2.5 py-0.5 font-heading text-[10px] font-bold text-white shadow">
                    <Crown className="h-3 w-3" />
                    Premium Vendor
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Order Action Form */}
          <div className="border-t border-line pt-6">
            {!mounted || isPending ? (
              <div className="h-28 w-full animate-pulse rounded-2xl bg-brand-soft" />
            ) : !session ? (
              <div className="flex flex-col gap-3">
                <Link
                  href={`/login?callbackUrl=${encodeURIComponent(`/menu/${item._id}`)}`}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand px-6 font-heading text-base font-semibold text-white shadow-lg shadow-brand/25 transition-transform hover:-translate-y-0.5"
                >
                  <ShoppingBag className="h-5 w-5" />
                  <span>Sign In to Order</span>
                </Link>
                <p className="text-center font-text text-xs text-ink-muted">
                  Please log in as a customer to place orders.
                </p>
              </div>
            ) : role === "customer" ? (
              <form onSubmit={handleOrder} className="flex flex-col gap-4">
                {/* Quantity selector */}
                <div className="flex items-center justify-between rounded-2xl border border-line bg-surface p-3.5">
                  <span className="font-heading text-sm font-semibold text-ink">Quantity</span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      disabled={quantity <= 1 || isSubmitting}
                      className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-line bg-surface text-ink hover:bg-brand-soft disabled:opacity-40"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-8 text-center font-heading text-base font-bold text-ink">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => q + 1)}
                      disabled={isSubmitting}
                      className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-line bg-surface text-ink hover:bg-brand-soft"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Delivery address */}
                <div>
                  <label htmlFor="delivery-address" className="mb-1.5 block font-heading text-xs font-semibold text-ink">
                    Delivery Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="delivery-address"
                    type="text"
                    required
                    value={deliveryAddress}
                    onChange={(e) => {
                      setDeliveryAddress(e.target.value)
                      if (orderErrors.deliveryAddress)
                        setOrderErrors((prev) => ({ ...prev, deliveryAddress: undefined }))
                    }}
                    placeholder="House, road, area, city"
                    disabled={isSubmitting}
                    className={`w-full rounded-xl border bg-surface px-3.5 py-2.5 font-text text-sm text-ink placeholder:text-ink-muted focus:border-brand focus:outline-none ${
                      orderErrors.deliveryAddress ? "border-red-500" : "border-line"
                    }`}
                  />
                  {orderErrors.deliveryAddress && (
                    <p className="mt-1 font-text text-xs text-red-500">
                      {orderErrors.deliveryAddress}
                    </p>
                  )}
                </div>

                {/* Customer phone */}
                <div>
                  <label htmlFor="customer-phone" className="mb-1.5 block font-heading text-xs font-semibold text-ink">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="customer-phone"
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => {
                      setCustomerPhone(e.target.value)
                      if (orderErrors.customerPhone)
                        setOrderErrors((prev) => ({ ...prev, customerPhone: undefined }))
                    }}
                    placeholder="e.g. 01700000000"
                    disabled={isSubmitting}
                    className={`w-full rounded-xl border bg-surface px-3.5 py-2.5 font-text text-sm text-ink placeholder:text-ink-muted focus:border-brand focus:outline-none ${
                      orderErrors.customerPhone ? "border-red-500" : "border-line"
                    }`}
                  />
                  {orderErrors.customerPhone && (
                    <p className="mt-1 font-text text-xs text-red-500">
                      {orderErrors.customerPhone}
                    </p>
                  )}
                </div>

                {/* Total amount summary */}
                <div className="flex items-center justify-between border-t border-line pt-2 text-sm">
                  <span className="font-text text-ink-muted">Total Payable:</span>
                  <span className="font-heading text-xl font-extrabold text-brand-fg">
                    {formatBDT(item.price * quantity)}
                  </span>
                </div>

                {/* Submit button */}
                <LoadingButton
                  type="submit"
                  isLoading={isSubmitting}
                  loadingText="Placing order…"
                  className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-brand px-6 font-heading text-base font-semibold text-white shadow-lg shadow-brand/25 transition-all hover:-translate-y-0.5 active:scale-95"
                >
                  <ShoppingBag className="h-5 w-5" />
                  <span>Order Now</span>
                </LoadingButton>
              </form>
            ) : (
              <div className="flex items-center gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-amber-900 dark:text-amber-200">
                <Info className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
                <p className="font-text text-sm font-medium">
                  Only customers can place orders.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <ItemReviewsSection
        itemId={item._id}
        initialReviews={reviews}
        ratingAvg={item.ratingAvg}
        ratingCount={item.ratingCount}
      />
    </div>
  )
}
