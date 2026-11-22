
"use client"

import React, { useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { Camera, UserRound, Mail, ShieldCheck, Store, ImagePlus } from "lucide-react"

import { authClient } from "@/lib/auth-client"
import { toastSuccess, toastError } from "@/lib/toast"
import { Skeleton } from "@/components/ui/skeleton"
import LoadingButton from "@/components/ui/LoadingButton"

const profileSchema = z.object({
  name: z.string().trim().min(2, "Full name must be at least 2 characters"),
  businessName: z
    .string()
    .trim()
    .min(2, "Restaurant name must be at least 2 characters")
    .optional()
    .or(z.literal("")),
})

export interface ProfileUserData {
  id: string
  name?: string | null
  email?: string | null
  image?: string | null
  role?: string | null
  businessName?: string | null
}

export interface ProfileSettingsFormProps {
  user: ProfileUserData
}

// Role badge
const RoleBadge = ({ role }: { role: string }) => (
  <span className="inline-flex items-center gap-1.5 rounded-full border border-brand/20 bg-brand-soft px-3 py-1.5 font-heading text-xs font-semibold capitalize text-brand-fg">
    <ShieldCheck className="h-3.5 w-3.5" />
    {role}
  </span>
)

// Loading skeleton
export const ProfileSkeleton = () => (
  <div className="w-full max-w-2xl space-y-6 p-4 sm:p-6 lg:p-8">
    <Skeleton className="h-10 w-48 rounded-xl" />

    <div className="space-y-6 rounded-2xl border border-line bg-surface p-6">
      <div className="flex items-center gap-4">
        <Skeleton className="h-24 w-24 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-4 w-48" />
        </div>
      </div>

      <Skeleton className="h-12 w-full rounded-xl" />
      <Skeleton className="h-12 w-full rounded-xl" />
      <Skeleton className="h-12 w-full rounded-xl" />
      <Skeleton className="ml-auto h-12 w-36 rounded-xl" />
    </div>
  </div>
)

export default function ProfileSettingsForm({
  user,
}: ProfileSettingsFormProps) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [name, setName] = useState(user.name ?? "")
  const [businessName, setBusinessName] = useState(
    user.businessName ?? "",
  )

  const [currentImage, setCurrentImage] = useState(user.image ?? "")
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  const [isSaving, setIsSaving] = useState(false)

  const [errors, setErrors] = useState<{
    name?: string
    businessName?: string
  }>({})

  const role = user.role ?? "customer"

  // Detect changes
  const hasNameChanged = name.trim() !== (user.name ?? "")

  const hasBusinessNameChanged =
    role === "vendor" &&
    businessName.trim() !== (user.businessName ?? "")

  const hasImageChanged = selectedImage !== null

  const hasChanges =
    hasNameChanged || hasBusinessNameChanged || hasImageChanged

  // Select profile image
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    if (!file) return

    // Validate image type
    if (!file.type.startsWith("image/")) {
      toastError("Invalid file", "Please select an image file.")
      return
    }

    // Validate image size
    if (file.size > 5 * 1024 * 1024) {
      toastError("Image too large", "Image size must be under 5MB.")
      return
    }

    const previewUrl = URL.createObjectURL(file)

    setSelectedImage(file)
    setPreviewImage(previewUrl)

    // Allow selecting the same file again
    e.target.value = ""
  }

  // Upload image via server route /api/upload
  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append("file", file)

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    })

    const result = await response.json()

    if (!response.ok || !result.url) {
      throw new Error(result.error || "Failed to upload profile image.")
    }

    return result.url
  }

  // Save profile changes
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!hasChanges) return

    const validation = profileSchema.safeParse({
      name: name.trim(),
      businessName: role === "vendor" ? businessName.trim() : "",
    })

    if (!validation.success) {
      const fieldErrors = validation.error.flatten().fieldErrors

      setErrors({
        name: fieldErrors.name?.[0],
        businessName: fieldErrors.businessName?.[0],
      })

      return
    }

    setErrors({})
    setIsSaving(true)

    try {
      const updatePayload: Record<string, unknown> = {
        name: name.trim(),
      }

      // Only update business name for vendors
      if (role === "vendor") {
        updatePayload.businessName = businessName.trim()
      }

      // Upload selected image before updating profile
      if (selectedImage) {
        const uploadedImageUrl = await uploadImage(selectedImage)

        updatePayload.image = uploadedImageUrl
      }

      const { error } = await authClient.updateUser(updatePayload)

      if (error) {
        toastError("Save failed", error.message)
        return
      }

      // Refresh session data
      try {
        await (authClient.getSession as (opts: unknown) => Promise<unknown>)({
          query: {
            disableCookieCache: true,
          },
        })
      } catch {
        // Session refresh fallback
      }

      // Update local state
      if (selectedImage && previewImage) {
        setCurrentImage(previewImage)
      }

      setSelectedImage(null)
      setPreviewImage(null)

      toastSuccess("Profile updated successfully.")

      router.refresh()
    } catch (error) {
      toastError(
        "Failed to save profile",
        error instanceof Error
          ? error.message
          : "Please try again.",
      )
    } finally {
      setIsSaving(false)
    }
  }

  const avatarImage = previewImage || currentImage

  return (
    <form
      onSubmit={handleSave}
      className="w-full max-w-2xl overflow-hidden rounded-2xl border border-line bg-surface shadow-sm"
    >
      {/* Profile header */}
      <div className="border-b border-line bg-brand-soft/20 px-5 py-6 sm:px-8">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-4 border-surface bg-brand-soft shadow-md">
              {avatarImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={avatarImage}
                  alt="Profile picture"
                  className="h-full w-full object-cover"
                />
              ) : (
                <UserRound className="h-12 w-12 text-brand-fg" />
              )}
            </div>

            {/* Image picker button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isSaving}
              aria-label="Change profile picture"
              className="absolute bottom-1 right-1 flex h-9 w-9 items-center justify-center rounded-full border-2 border-surface bg-brand text-white shadow-md transition hover:scale-105 hover:bg-brand/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Camera className="h-4 w-4" />
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageSelect}
              disabled={isSaving}
            />
          </div>

          {/* Profile information */}
          <div className="text-center sm:text-left">
            <h2 className="font-heading text-xl font-bold text-ink">
              {name || "Your name"}
            </h2>

            <p className="mt-1 font-text text-sm text-ink-muted">
              {user.email}
            </p>

            <div className="mt-3 flex justify-center sm:justify-start">
              <RoleBadge role={role} />
            </div>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isSaving}
              className="mt-3 inline-flex items-center gap-1.5 font-text text-xs font-medium text-brand-fg transition hover:underline disabled:opacity-50"
            >
              <ImagePlus className="h-3.5 w-3.5" />
              Change profile photo
            </button>

            <p className="mt-1 font-text text-xs text-ink-muted">
              JPG, PNG or WebP · Maximum 5MB
            </p>
          </div>
        </div>
      </div>

      {/* Form fields */}
      <div className="space-y-5 p-5 sm:p-8">
        {/* Full name */}
        <div>
          <label
            htmlFor="prof-name"
            className="mb-2 block font-heading text-sm font-semibold text-ink"
          >
            Full name
          </label>

          <div className="relative">
            <UserRound className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />

            <input
              id="prof-name"
              type="text"
              required
              value={name}
              onChange={(e) => {
                setName(e.target.value)

                if (errors.name) {
                  setErrors((prev) => ({
                    ...prev,
                    name: undefined,
                  }))
                }
              }}
              disabled={isSaving}
              placeholder="Enter your full name"
              className={`h-12 w-full rounded-xl border bg-surface pl-11 pr-4 font-text text-sm text-ink placeholder:text-ink-muted/60 transition focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 disabled:opacity-60 ${
                errors.name ? "border-red-500" : "border-line"
              }`}
            />
          </div>

          {errors.name && (
            <p className="mt-1.5 font-text text-xs text-red-500">
              {errors.name}
            </p>
          )}
        </div>

        {/* Vendor business name */}
        {role === "vendor" && (
          <div>
            <label
              htmlFor="prof-business"
              className="mb-2 block font-heading text-sm font-semibold text-ink"
            >
              Restaurant name
            </label>

            <div className="relative">
              <Store className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />

              <input
                id="prof-business"
                type="text"
                value={businessName}
                onChange={(e) => {
                  setBusinessName(e.target.value)

                  if (errors.businessName) {
                    setErrors((prev) => ({
                      ...prev,
                      businessName: undefined,
                    }))
                  }
                }}
                disabled={isSaving}
                placeholder="Enter your restaurant name"
                className={`h-12 w-full rounded-xl border bg-surface pl-11 pr-4 font-text text-sm text-ink placeholder:text-ink-muted/60 transition focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 disabled:opacity-60 ${
                  errors.businessName
                    ? "border-red-500"
                    : "border-line"
                }`}
              />
            </div>

            {errors.businessName && (
              <p className="mt-1.5 font-text text-xs text-red-500">
                {errors.businessName}
              </p>
            )}
          </div>
        )}

        {/* Email */}
        <div>
          <label
            htmlFor="prof-email"
            className="mb-2 block font-heading text-sm font-semibold text-ink"
          >
            Email address
          </label>

          <div className="relative">
            <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />

            <input
              id="prof-email"
              type="email"
              value={user.email ?? ""}
              readOnly
              className="h-12 w-full cursor-not-allowed rounded-xl border border-line bg-brand-soft/20 pl-11 pr-4 font-text text-sm text-ink-muted"
            />
          </div>

          <p className="mt-1.5 font-text text-xs text-ink-muted">
            Your email address cannot be changed here.
          </p>
        </div>

        {/* Role */}
        <div>
          <span className="mb-2 block font-heading text-sm font-semibold text-ink">
            Account role
          </span>

          <div className="flex h-12 items-center rounded-xl border border-line bg-brand-soft/20 px-4">
            <RoleBadge role={role} />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex flex-col-reverse gap-3 border-t border-line bg-brand-soft/10 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p className="font-text text-xs text-ink-muted">
          {hasChanges
            ? "You have unsaved changes."
            : "Your profile is up to date."}
        </p>

        <LoadingButton
          type="submit"
          isLoading={isSaving}
          loadingText="Saving changes..."
          disabled={!hasChanges || isSaving}
          className={`h-11 w-full min-w-36 rounded-xl px-6 font-heading text-sm font-semibold transition-all sm:w-auto ${
            hasChanges
              ? "cursor-pointer bg-brand text-white shadow-md shadow-brand/20 hover:-translate-y-0.5 hover:shadow-lg"
              : "cursor-not-allowed bg-brand/40 text-white/80"
          }`}
        >
          Save changes
        </LoadingButton>
      </div>
    </form>
  )
}
