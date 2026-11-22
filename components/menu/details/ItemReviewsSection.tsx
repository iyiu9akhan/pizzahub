"use client"

import React, { useState, useSyncExternalStore } from "react"
import Link from "next/link"
import { z } from "zod"
import { Star, Trash2, MessageSquare, AlertCircle, Sparkles, Send } from "lucide-react"
import { useSession } from "@/lib/auth-client"
import UserAvatar from "@/components/ui/UserAvatar"
import LoadingButton from "@/components/ui/LoadingButton"
import { toastSuccess, toastError, toastInfo } from "@/lib/toast"
import { addReviewAction, deleteReviewAction } from "@/lib/actions/ReviewActions"

export interface ReviewItem {
  _id: string
  itemId: string
  userId: string
  userName?: string
  userImage?: string
  userEmail?: string
  rating: number
  comment?: string
  createdAt?: string
}

export interface ItemReviewsSectionProps {
  itemId: string
  initialReviews?: ReviewItem[]
  ratingAvg?: number
  ratingCount?: number
}

const emptySubscribe = () => () => {}

const reviewSchema = z.object({
  rating: z
    .number()
    .min(1, "Please choose a rating between 1 and 5 stars.")
    .max(5, "Rating cannot exceed 5 stars."),
  comment: z
    .string()
    .trim()
    .min(3, "Your review comment must be at least 3 characters.")
    .max(500, "Your review cannot exceed 500 characters."),
})

export default function ItemReviewsSection({
  itemId,
  initialReviews = [],
  ratingAvg,
  ratingCount,
}: ItemReviewsSectionProps) {
  const { data: session } = useSession()
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false)

  const [reviews, setReviews] = useState<ReviewItem[]>(initialReviews)
  const [rating, setRating] = useState<number>(5)
  const [hoverRating, setHoverRating] = useState<number | null>(null)
  const [comment, setComment] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<{ rating?: string; comment?: string }>({})
  const [receivedOnlyHint, setReceivedOnlyHint] = useState<string | null>(null)

  const userRole = (session?.user as { role?: string } | undefined)?.role || "customer"
  const currentUserId = session?.user?.id

  // Calculate or fallback rating summary
  const totalCount = reviews.length > 0 ? reviews.length : ratingCount || 0
  const averageScore =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : typeof ratingAvg === "number" && ratingAvg > 0
      ? ratingAvg.toFixed(1)
      : null

  const handleRatingClick = (newRating: number) => {
    setRating(newRating)
    if (fieldErrors.rating) {
      setFieldErrors((prev) => ({ ...prev, rating: undefined }))
    }
  }

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    setReceivedOnlyHint(null)

    if (!session?.user) {
      toastInfo("Please sign in as a customer to review this item.")
      return
    }

    if (userRole !== "customer") {
      toastInfo("Only customer accounts can submit reviews.")
      return
    }

    const validation = reviewSchema.safeParse({ rating, comment: comment.trim() })
    if (!validation.success) {
      const errors = validation.error.flatten().fieldErrors
      setFieldErrors({
        rating: errors.rating?.[0],
        comment: errors.comment?.[0],
      })
      return
    }

    setFieldErrors({})
    setIsSubmitting(true)

    try {
      const res = await addReviewAction({
        itemId,
        rating,
        comment: comment.trim(),
      })

      if (res.success) {
        toastSuccess("Review submitted successfully!")
        const newReview: ReviewItem = {
          _id: `temp-${Date.now()}`,
          itemId,
          userId: currentUserId || "me",
          userName: session.user.name || "Customer",
          userImage: session.user.image || undefined,
          rating,
          comment: comment.trim(),
          createdAt: new Date().toISOString(),
        }

        // Upsert review in local state
        setReviews((prev) => {
          const existingIdx = prev.findIndex((r) => r.userId === currentUserId)
          if (existingIdx !== -1) {
            const next = [...prev]
            next[existingIdx] = newReview
            return next
          }
          return [newReview, ...prev]
        })

        setComment("")
        setRating(5)
      } else {
        const msg = res.message?.toLowerCase() || ""
        if (
          res.code === "FORBIDDEN" ||
          msg.includes("received") ||
          msg.includes("delivered") ||
          msg.includes("order")
        ) {
          setReceivedOnlyHint(
            "You can only review pizzas from orders you have successfully received and had delivered."
          )
          toastError(
            "Order verification required",
            "Only customers who ordered and received this pizza can review it."
          )
        } else {
          toastError("Failed to submit review", res.message || "An error occurred.")
        }
      }
    } catch {
      toastError("Failed to submit review", "An unexpected network error occurred.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteReview = async (reviewId: string) => {
    setDeletingId(reviewId)
    const prevReviews = reviews
    setReviews((curr) => curr.filter((r) => r._id !== reviewId))

    try {
      const res = await deleteReviewAction(reviewId, itemId)
      if (res.success) {
        toastSuccess("Review deleted.")
      } else {
        setReviews(prevReviews)
        toastError("Delete failed", res.message || "Could not delete review.")
      }
    } catch {
      setReviews(prevReviews)
      toastError("Delete failed", "An error occurred while deleting the review.")
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <section className="mt-16 border-t border-line pt-12">
      {/* Header & Overall Rating */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-heading text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            Customer Reviews & Ratings
          </h2>
          <p className="mt-1 font-text text-sm text-ink-muted">
            Read real feedback from customers who have ordered this pizza.
          </p>
        </div>

        {/* Rating summary badge */}
        <div className="flex items-center gap-3 rounded-2xl border border-line bg-surface px-5 py-3 shadow-xs">
          <div className="flex items-center gap-1 text-amber-500">
            <Star className="h-6 w-6 fill-current" />
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-heading text-2xl font-black text-ink">
                {averageScore ?? "New"}
              </span>
              {averageScore && (
                <span className="font-text text-xs text-ink-muted">/ 5.0</span>
              )}
            </div>
            <p className="font-text text-xs text-ink-muted">
              {totalCount} {totalCount === 1 ? "review" : "reviews"}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-12 lg:grid-cols-12">
        {/* Left: Review List (7 cols on lg) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between border-b border-line pb-3">
            <h3 className="font-heading text-lg font-bold text-ink">
              All Reviews ({reviews.length})
            </h3>
          </div>

          {reviews.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-line bg-surface p-10 text-center">
              <MessageSquare className="h-10 w-10 text-ink-muted/50" />
              <h4 className="mt-3 font-heading text-base font-semibold text-ink">
                No reviews yet
              </h4>
              <p className="mt-1 max-w-sm font-text text-xs text-ink-muted">
                Be the first to share your experience with this delicious pizza after ordering!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((rev) => {
                const isOwner = rev.userId === currentUserId
                const isAdmin = userRole === "admin"
                const canDelete = isOwner || isAdmin
                const isDeleting = deletingId === rev._id

                return (
                  <article
                    key={rev._id}
                    className="flex flex-col gap-3 rounded-2xl border border-line bg-surface p-5 shadow-2xs transition-shadow hover:shadow-xs"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <UserAvatar
                          src={rev.userImage}
                          name={rev.userName || "Customer"}
                          size="md"
                        />
                        <div>
                          <h4 className="font-heading text-sm font-bold text-ink">
                            {rev.userName || "Verified Customer"}
                          </h4>
                          {mounted && rev.createdAt && (
                            <p className="font-text text-[11px] text-ink-muted">
                              {new Date(rev.createdAt).toLocaleDateString(undefined, {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Delete button (owner or admin) */}
                      {canDelete && (
                        <LoadingButton
                          type="button"
                          isLoading={isDeleting}
                          loadingText=""
                          onClick={() => handleDeleteReview(rev._id)}
                          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-line bg-surface text-ink-muted transition-colors hover:border-red-500/30 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10 dark:hover:text-red-400"
                          title={isAdmin ? "Delete as Admin" : "Delete your review"}
                        >
                          <Trash2 className="h-4 w-4" />
                        </LoadingButton>
                      )}
                    </div>

                    {/* Star Rating display */}
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < rev.rating
                              ? "fill-amber-400 text-amber-400"
                              : "text-line"
                          }`}
                        />
                      ))}
                    </div>

                    {/* Comment text */}
                    {rev.comment && (
                      <p className="font-text text-sm leading-relaxed text-ink">
                        {rev.comment}
                      </p>
                    )}
                  </article>
                )
              })}
            </div>
          )}
        </div>

        {/* Right: Review Form (5 cols on lg) */}
        <div className="lg:col-span-5">
          <div className="sticky top-24 rounded-3xl border border-line bg-surface p-6 shadow-sm">
            <div className="flex items-center gap-2 text-brand-fg">
              <Sparkles className="h-5 w-5" />
              <h3 className="font-heading text-lg font-bold text-ink">
                Write a Review
              </h3>
            </div>
            <p className="mt-1 font-text text-xs text-ink-muted">
              Only customers who have received this pizza can submit a review.
            </p>

            {/* Friendly hint if received restriction triggered */}
            {receivedOnlyHint && (
              <div className="mt-4 flex items-start gap-2.5 rounded-2xl border border-amber-300/80 bg-amber-50 p-3.5 text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
                <p className="font-text text-xs leading-relaxed">
                  {receivedOnlyHint}
                </p>
              </div>
            )}

            {!mounted ? (
              <div className="mt-6 h-36 w-full animate-pulse rounded-2xl bg-brand-soft/40" />
            ) : !session ? (
              <div className="mt-6 flex flex-col items-center justify-center rounded-2xl border border-dashed border-line p-6 text-center">
                <p className="font-text text-sm text-ink-muted">
                  Please log in with a customer account to write a review.
                </p>
                <Link
                  href={`/login?callbackUrl=${encodeURIComponent(`/menu/${itemId}`)}`}
                  className="mt-4 inline-flex items-center justify-center rounded-xl bg-brand px-5 py-2 font-heading text-xs font-semibold text-white shadow-sm transition-transform hover:-translate-y-0.5 active:scale-95"
                >
                  Sign In to Review
                </Link>
              </div>
            ) : userRole !== "customer" ? (
              <div className="mt-6 rounded-2xl border border-line bg-brand-soft/30 p-4 text-center">
                <p className="font-text text-xs text-ink-muted">
                  Logged in as a {userRole}. Only customer accounts can leave reviews.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="mt-5 space-y-4">
                {/* Rating Input Stars */}
                <div>
                  <label className="block font-heading text-xs font-semibold text-ink mb-1.5">
                    Your Rating
                  </label>
                  <div className="flex items-center gap-1.5">
                    {Array.from({ length: 5 }).map((_, index) => {
                      const starValue = index + 1
                      const isFilled =
                        hoverRating !== null
                          ? starValue <= hoverRating
                          : starValue <= rating

                      return (
                        <button
                          key={starValue}
                          type="button"
                          onClick={() => handleRatingClick(starValue)}
                          onMouseEnter={() => setHoverRating(starValue)}
                          onMouseLeave={() => setHoverRating(null)}
                          className="cursor-pointer p-1 transition-transform hover:scale-110 active:scale-95 focus-visible:outline-none"
                          aria-label={`Rate ${starValue} out of 5 stars`}
                        >
                          <Star
                            className={`h-6 w-6 transition-colors ${
                              isFilled
                                ? "fill-amber-400 text-amber-400"
                                : "text-line hover:text-amber-200"
                            }`}
                          />
                        </button>
                      )
                    })}
                    <span className="ml-2 font-heading text-xs font-bold text-ink">
                      {hoverRating ?? rating} / 5
                    </span>
                  </div>
                  {fieldErrors.rating && (
                    <p className="mt-1 font-text text-xs text-red-500">
                      {fieldErrors.rating}
                    </p>
                  )}
                </div>

                {/* Comment Textarea */}
                <div>
                  <label
                    htmlFor="review-comment"
                    className="block font-heading text-xs font-semibold text-ink mb-1.5"
                  >
                    Your Review
                  </label>
                  <textarea
                    id="review-comment"
                    rows={4}
                    required
                    value={comment}
                    onChange={(e) => {
                      setComment(e.target.value)
                      if (fieldErrors.comment) {
                        setFieldErrors((prev) => ({ ...prev, comment: undefined }))
                      }
                    }}
                    placeholder="Tell us what you liked about the crust, cheese, sauce, or delivery..."
                    disabled={isSubmitting}
                    className="w-full resize-none rounded-xl border border-line bg-surface p-3 font-text text-sm text-ink placeholder:text-ink-muted/70 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                  />
                  {fieldErrors.comment && (
                    <p className="mt-1 font-text text-xs text-red-500">
                      {fieldErrors.comment}
                    </p>
                  )}
                  <p className="mt-1 text-right font-text text-[11px] text-ink-muted">
                    {comment.length} / 500 characters
                  </p>
                </div>

                {/* Submit button */}
                <LoadingButton
                  type="submit"
                  isLoading={isSubmitting}
                  loadingText="Posting review…"
                  className="flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-brand px-5 font-heading text-sm font-semibold text-white shadow-md shadow-brand/20 transition-all hover:-translate-y-0.5 active:scale-95"
                >
                  <Send className="h-4 w-4" />
                  <span>Submit Review</span>
                </LoadingButton>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
