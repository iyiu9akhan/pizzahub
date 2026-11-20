"use client"

import React, { useEffect, useState, useSyncExternalStore } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"

import Navbar from "@/components/header/navbar/Navbar"
import Footer from "@/components/home/Footer"
import MenuItemDetails from "@/components/menu/details/MenuItemDetails"

import { getItemById } from "@/lib/api/items"
import { toastInfo } from "@/lib/toast"

import { ArrowLeft, Pizza } from "lucide-react"

import type { MenuItem } from "@/types/menu"
import { useSession } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import OrderPizza from "@/lib/actions/OrderPizza"
import type OrderPizzaType from "@/types/OrderPizzaType"

// Subscription for client hydration detection without setState in effect
const emptySubscribe = () => () => {}

export default function ItemDetailsPage() {
  const params = useParams<{ id: string }>()
  const itemId = params.id

  const { data: session } = useSession()

  const [item, setItem] = useState<MenuItem | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  )
  const router = useRouter()

  // Fetch menu item
  useEffect(() => {
    if (!itemId) return

    const fetchItem = async () => {
      setIsLoading(true)

      try {
        const res = await getItemById(itemId)
        const rawItem = res?.item || res

        if (!rawItem?._id) {
          setItem(null)
          return
        }

        const normalizedItem: MenuItem = {
          ...rawItem,
          images: Array.from(
            new Set([
              ...(rawItem.images || []),
              ...(rawItem.existingImages || []),
            ])
          ),
        }

        setItem(normalizedItem)
      } catch {
        setItem(null)
      } finally {
        setIsLoading(false)
      }
    }

    fetchItem()
  }, [itemId])

  // Order button action
  const handleOrderClick = async () => {
    if (!session?.user || !item) return

    // Block the order if the item has no vendor (order could not reach any vendor dashboard)
    if (!item.vendorId) {
      toastInfo("Order failed!", "This item has no vendor assigned.")
      return
    }

    try {
      const orderData: OrderPizzaType = {
        vendorId: item.vendorId,
        vendorName: item.vendorName,

        customerId: session.user.id,
        customerName: session.user.name,
        customerEmail: session.user.email,
        customerPhone: "",
        deliveryAddress: "",
        items: [
          {
            itemId: item._id,
            itemName: item.itemName,
            price: item.price,
            quantity: 1,
            image: item.images?.[0],
          },
        ],
        totalAmount: item.price,
        status: "pending",
      }

      const result = await OrderPizza(orderData)

      if (result.insertedId || result.success) {
        toastInfo(
          "Order placed successfully!",
          "Your order has been submitted."
        )
        router.push("/menu")
      } else {
        toastInfo(
          "Order failed!",
          "Something went wrong while placing your order."
        )
      }
    } catch (error) {
      console.error("Order error:", error)
      toastInfo(
        "Order failed!",
        "Unable to place your order. Please try again."
      )
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-page transition-colors duration-300">
      {/* Navbar renders after hydration */}
      {mounted && <Navbar />}

      <main className="flex-1">
        {isLoading ? (
          <div className="mx-auto max-w-6xl px-6 py-10 lg:py-16">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
              <div className="aspect-4/3 animate-pulse rounded-3xl bg-brand-soft" />

              <div className="flex flex-col gap-4">
                <div className="h-8 w-2/3 animate-pulse rounded-xl bg-brand-soft" />

                <div className="h-6 w-1/3 animate-pulse rounded-xl bg-brand-soft" />

                <div className="h-24 animate-pulse rounded-xl bg-brand-soft" />
              </div>
            </div>
          </div>
        ) : !item ? (
          <div className="flex min-h-[60vh] items-center justify-center p-6">
            <div className="flex max-w-md flex-col items-center justify-center rounded-3xl border border-line bg-surface p-10 text-center shadow-md">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-soft text-brand-fg">
                <Pizza className="h-8 w-8" />
              </div>

              <h1 className="mt-4 font-heading text-2xl font-bold text-ink">
                Item Not Found
              </h1>

              <p className="mt-2 font-text text-sm leading-relaxed text-ink-muted">
                The pizza or menu item you are looking for does not exist or has
                been removed.
              </p>

              <Link
                href="/menu"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand px-6 py-2.5 font-heading text-sm font-semibold text-white shadow-sm transition-transform hover:-translate-y-0.5 active:scale-95"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Menu</span>
              </Link>
            </div>
          </div>
        ) : mounted ? (
          <MenuItemDetails item={item} onOrderClick={handleOrderClick} />
        ) : (
          <div className="mx-auto max-w-6xl px-6 py-10 lg:py-16">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
              <div className="aspect-4/3 animate-pulse rounded-3xl bg-brand-soft" />

              <div className="flex flex-col gap-4">
                <div className="h-8 w-2/3 animate-pulse rounded-xl bg-brand-soft" />

                <div className="h-6 w-1/3 animate-pulse rounded-xl bg-brand-soft" />

                <div className="h-24 animate-pulse rounded-xl bg-brand-soft" />
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
