// Shared Profile Settings Form component.
// Reused across Customer (/dashboard/customer/profile), Vendor (/dashboard/vendor/profile),
// and Admin (/dashboard/admin/profile) dashboards.
// Supports photo preview, ImgBB upload, session cache invalidation, and role-specific fields.
"use client"

import React, { useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Camera, X } from "lucide-react"

import { authClient } from "@/lib/auth-client"
import { toastSuccess, toastError } from "@/lib/toast"
import { Skeleton } from "@/components/ui/skeleton"
import LoadingButton from "@/components/ui/LoadingButton"
import UserAvatar from "@/components/ui/UserAvatar"

// Allowed image MIME types and maximum file size
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"]
const MAX_IMAGE_SIZE = 5 * 1024 * 1024 // 5 MB

// Role badge visual indicator
const RoleBadge = ({ role }: { role: string }) => (
  <span className="inline-flex items-center rounded-full bg-brand-soft px-3 py-1 font-heading text-xs font-semibold capitalize text-brand-fg">
    {role}
  </span>
)

// Reusable profile loading skeleton
export const ProfileSkeleton = () => (
  <div className="w-full max-w-2xl space-y-6 p-4 sm:p-6 lg:p-8">
    <Skeleton className="h-10 w-48 rounded-xl" />
    <div className="space-y-5 rounded-2xl border border-line bg-surface p-6">
      <Skeleton className="mx-auto h-28 w-28 rounded-full" />
      <Skeleton className="h-12 w-full rounded-xl" />
      <Skeleton className="h-12 w-full rounded-xl" />
      <Skeleton className="h-12 w-full rounded-xl" />
      <Skeleton className="ml-auto h-12 w-36 rounded-xl" />
    </div>
  </div>
)

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

export default function ProfileSettingsForm({ user }: ProfileSettingsFormProps) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Local state initialized with current user data
  const [name, setName] = useState(user.name ?? "")
  const [businessName, setBusinessName] = useState(user.businessName ?? "")
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [imageError, setImageError] = useState("")

  const role = user.role ?? "customer"

  // Handle image file selection with validation
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!ALLOWED_TYPES.includes(file.type)) {
      setImageError("Only JPG, PNG, or WEBP images are allowed.")
      return
    }
    if (file.size > MAX_IMAGE_SIZE) {
      setImageError("Image must be smaller than 5 MB.")
      return
    }

    setImageError("")
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  // Remove the selected image preview and reset input
  const handleRemoveImage = () => {
    setImageFile(null)
    setImagePreview(null)
    setImageError("")
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  // Save changes: upload image to ImgBB via route handler, update Better Auth user, and refresh session
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      let uploadedImageUrl: string | undefined

      // Upload image via server proxy if a new file was chosen
      if (imageFile) {
        const formData = new FormData()
        formData.append("file", imageFile)

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })
        const uploadData = await uploadRes.json()

        if (!uploadRes.ok || !uploadData.url) {
          toastError("Image upload failed", uploadData.error || "Please try again.")
          setIsSaving(false)
          return
        }
        uploadedImageUrl = uploadData.url as string
      }

      // Payload contains only allowed editable fields (never email, role, or subscription)
      const updatePayload: Record<string, unknown> = {
        name: name.trim(),
      }

      if (role === "vendor") {
        updatePayload.businessName = businessName.trim()
      }

      if (uploadedImageUrl) {
        updatePayload.image = uploadedImageUrl
      }

      const { error } = await authClient.updateUser(updatePayload)

      if (error) {
        toastError("Save failed", error.message)
        return
      }

      // Bypasses cookie cache to immediately synchronize updated profile across client components
      try {
        await (authClient.getSession as (opts: unknown) => Promise<unknown>)({
          query: { disableCookieCache: true },
        })
      } catch {
        // Fallback session refresh
      }

      toastSuccess("Profile updated.")
      setImageFile(null)
      setImagePreview(null)
      router.refresh()
    } catch {
      toastError("Failed to save profile. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <form
      onSubmit={handleSave}
      className="w-full max-w-2xl space-y-6 rounded-2xl border border-line bg-surface p-5 shadow-sm sm:p-6"
    >
      {/* Profile image upload with preview and remove buttons */}
      <div className="flex flex-col items-center gap-3">
        <div className="relative">
          {imagePreview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imagePreview}
              alt="Profile preview"
              className="h-28 w-28 rounded-full border-4 border-line object-cover"
            />
          ) : (
            <UserAvatar
              src={user.image}
              name={user.name ?? "User"}
              size="lg"
              className="h-28 w-28 border-4 border-line"
            />
          )}

          {/* Camera icon button to open file selector */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            title="Change profile image"
            aria-label="Change profile image"
            className="absolute bottom-1 right-1 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-brand text-white shadow-md transition-transform hover:scale-110"
          >
            <Camera className="h-4 w-4" />
          </button>

          {/* Remove preview button */}
          {imagePreview && (
            <button
              type="button"
              onClick={handleRemoveImage}
              title="Remove image preview"
              aria-label="Remove image preview"
              className="absolute -right-1 -top-1 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-red-600 text-white shadow transition-transform hover:scale-110"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="sr-only"
          onChange={handleImageChange}
        />

        {imageError && (
          <p role="alert" className="text-xs text-red-500">
            {imageError}
          </p>
        )}
        <p className="font-text text-xs text-ink-muted">
          JPG, PNG or WEBP · Max 5 MB
        </p>
      </div>

      {/* Full name input */}
      <div>
        <label
          htmlFor="prof-name"
          className="mb-2 block font-heading text-sm font-semibold text-ink"
        >
          Full name
        </label>
        <input
          id="prof-name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isSaving}
          className="h-12 w-full rounded-xl border border-line bg-surface px-4 font-text text-sm text-ink placeholder:text-ink-muted/60 transition-all focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 disabled:opacity-60"
        />
      </div>

      {/* Restaurant (business) name input — vendor-only field */}
      {role === "vendor" && (
        <div>
          <label
            htmlFor="prof-business"
            className="mb-2 block font-heading text-sm font-semibold text-ink"
          >
            Restaurant name
          </label>
          <input
            id="prof-business"
            type="text"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            disabled={isSaving}
            placeholder="e.g. Dhaka Pizza Co."
            className="h-12 w-full rounded-xl border border-line bg-surface px-4 font-text text-sm text-ink placeholder:text-ink-muted/60 transition-all focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 disabled:opacity-60"
          />
        </div>
      )}

      {/* Read-only email address */}
      <div>
        <label className="mb-2 block font-heading text-sm font-semibold text-ink">
          Email
        </label>
        <input
          type="email"
          value={user.email ?? ""}
          readOnly
          className="h-12 w-full cursor-not-allowed rounded-xl border border-line bg-brand-soft/30 px-4 font-text text-sm text-ink-muted"
        />
        <p className="mt-1 font-text text-xs text-ink-muted">
          Email cannot be changed here.
        </p>
      </div>

      {/* Read-only role badge */}
      <div>
        <span className="mb-2 block font-heading text-sm font-semibold text-ink">
          Role
        </span>
        <RoleBadge role={role} />
      </div>

      {/* Submit button with loading spinner */}
      <div className="flex justify-end border-t border-line pt-4">
        <LoadingButton
          type="submit"
          isLoading={isSaving}
          loadingText="Saving…"
          className="h-12 min-w-36 cursor-pointer rounded-xl bg-brand px-7 font-heading text-sm font-semibold text-white shadow-lg shadow-brand/25 transition-all hover:-translate-y-0.5 hover:shadow-xl"
        >
          Save changes
        </LoadingButton>
      </div>
    </form>
  )
}
