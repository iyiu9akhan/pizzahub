// Shared Profile Settings Form component.
// Reused across Customer (/dashboard/customer/profile), Vendor (/dashboard/vendor/profile),
// and Admin (/dashboard/admin/profile) dashboards.
// Supports photo preview, ImgBB upload, session cache invalidation, and role-specific fields.
"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"

import { authClient } from "@/lib/auth-client"
import { toastSuccess, toastError } from "@/lib/toast"
import { Skeleton } from "@/components/ui/skeleton"
import LoadingButton from "@/components/ui/LoadingButton"
import ProfileAvatarUploader from "@/components/dashboard/profile/ProfileAvatarUploader"

const profileSchema = z.object({
  name: z.string().trim().min(2, "Full name must be at least 2 characters"),
  businessName: z.string().trim().min(2, "Restaurant name must be at least 2 characters").optional().or(z.literal("")),
})

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

  // Local state initialized with current user data
  const [name, setName] = useState(user.name ?? "")
  const [businessName, setBusinessName] = useState(user.businessName ?? "")
  const [currentImage, setCurrentImage] = useState<string | null | undefined>(user.image)
  const [isSaving, setIsSaving] = useState(false)
  const [errors, setErrors] = useState<{ name?: string; businessName?: string }>({})

  const role = user.role ?? "customer"

  // Save changes: update Better Auth user and refresh session
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()

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
      // Payload contains only allowed editable fields (never email, role, or subscription)
      const updatePayload: Record<string, unknown> = {
        name: name.trim(),
      }

      if (role === "vendor") {
        updatePayload.businessName = businessName.trim()
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
      {/* Shared profile image uploader with preview and Better Auth update */}
      <ProfileAvatarUploader
        currentImage={currentImage}
        userName={name || user.name || "User"}
        onImageUpdated={(url) => setCurrentImage(url)}
      />

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
          onChange={(e) => {
            setName(e.target.value)
            if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }))
          }}
          disabled={isSaving}
          className={`h-12 w-full rounded-xl border bg-surface px-4 font-text text-sm text-ink placeholder:text-ink-muted/60 transition-all focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 disabled:opacity-60 ${
            errors.name ? "border-red-500" : "border-line"
          }`}
        />
        {errors.name && (
          <p className="mt-1 font-text text-xs text-red-500">{errors.name}</p>
        )}
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
            onChange={(e) => {
              setBusinessName(e.target.value)
              if (errors.businessName)
                setErrors((prev) => ({ ...prev, businessName: undefined }))
            }}
            disabled={isSaving}
            placeholder="e.g. Dhaka Pizza Co."
            className={`h-12 w-full rounded-xl border bg-surface px-4 font-text text-sm text-ink placeholder:text-ink-muted/60 transition-all focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 disabled:opacity-60 ${
              errors.businessName ? "border-red-500" : "border-line"
            }`}
          />
          {errors.businessName && (
            <p className="mt-1 font-text text-xs text-red-500">
              {errors.businessName}
            </p>
          )}
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
