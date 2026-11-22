// Shared ProfileImageUploader component.
// Reusable across Admin, Vendor, and Customer profile settings.
// Manages profile image changes with instant client preview, validation, ImgBB upload,
// and session synchronization.
"use client"

import React, { useEffect, useRef, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Camera, Trash2, Upload, X } from "lucide-react"

import { authClient } from "@/lib/auth-client"
import { toastSuccess, toastError } from "@/lib/toast"
import LoadingButton from "@/components/ui/LoadingButton"
import UserAvatar, { resolveAvatar } from "@/components/ui/UserAvatar"
import { updateProfileImage, removeProfileImage } from "@/lib/actions/ProfileImage"

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"]
const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2 MB

export interface ProfileImageUploaderProps {
  currentImage?: string | null
  userName?: string
  userRole?: string | null
  onImageUpdated?: (newImageUrl: string | null) => void
  className?: string
}

export default function ProfileImageUploader({
  currentImage,
  userName = "User",
  userRole,
  onImageUpdated,
  className = "",
}: ProfileImageUploaderProps) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isPending, startTransition] = useTransition()

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [clientError, setClientError] = useState<string>("")

  // Clean up object URLs on change or unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  // Clear staged selection
  const handleCancel = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }
    setSelectedFile(null)
    setPreviewUrl(null)
    setClientError("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  // Handle client-side file selection & validation
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!ALLOWED_TYPES.includes(file.type)) {
      const msg = "Invalid image type or size"
      setClientError(msg)
      toastError("Upload failed", msg)
      if (fileInputRef.current) fileInputRef.current.value = ""
      return
    }

    if (file.size > MAX_FILE_SIZE) {
      const msg = "Invalid image type or size"
      setClientError(msg)
      toastError("Upload failed", msg)
      if (fileInputRef.current) fileInputRef.current.value = ""
      return
    }

    // Revoke previous preview if any
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }

    setClientError("")
    setSelectedFile(file)
    setPreviewUrl(URL.createObjectURL(file))
  }

  // Save selected image using server action
  const handleSave = () => {
    if (!selectedFile) return

    startTransition(async () => {
      const formData = new FormData()
      formData.append("file", selectedFile)

      const result = await updateProfileImage(formData)

      if (!result.success || !result.image) {
        toastError("Upload failed", result.message || "Failed to update profile image")
        return
      }

      // Refresh client session cache
      try {
        await (authClient.getSession as (opts: unknown) => Promise<unknown>)({
          query: { disableCookieCache: true },
        })
      } catch {
        // Fallback session refresh
      }

      toastSuccess("Profile picture updated.")
      onImageUpdated?.(result.image)
      handleCancel()
      router.refresh()
    })
  }

  // Remove profile image using server action (with confirmation)
  const handleRemove = () => {
    const confirmed = window.confirm(
      "Are you sure you want to remove your profile picture?"
    )
    if (!confirmed) return

    startTransition(async () => {
      const result = await removeProfileImage()

      if (!result.success) {
        toastError(
          "Failed to remove picture",
          result.message || "Could not remove picture."
        )
        return
      }

      // Refresh client session cache
      try {
        await (authClient.getSession as (opts: unknown) => Promise<unknown>)({
          query: { disableCookieCache: true },
        })
      } catch {
        // Fallback session refresh
      }

      toastSuccess("Profile picture removed.")
      onImageUpdated?.(null)
      handleCancel()
      router.refresh()
    })
  }

  const roleDefault = resolveAvatar(null, userRole)
  const hasCustomImage = resolveAvatar(currentImage, userRole) !== roleDefault

  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      {/* Avatar with Camera Trigger */}
      <div className="relative">
        {previewUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={previewUrl}
            alt="Profile preview"
            className="h-28 w-28 rounded-full border-4 border-line object-cover shadow-xs"
          />
        ) : (
          <UserAvatar
            image={currentImage}
            role={userRole}
            name={userName}
            size="lg"
            className="h-28 w-28 border-4 border-line shadow-xs"
          />
        )}

        {/* Change photo button */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          title="Choose photo"
          aria-label="Choose photo"
          disabled={isPending}
          className="absolute bottom-1 right-1 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-brand text-white shadow-md transition-transform hover:scale-110 disabled:opacity-50"
        >
          <Camera className="h-4 w-4" />
        </button>

        {/* Cancel staged selection button on top-right */}
        {previewUrl && !isPending && (
          <button
            type="button"
            onClick={handleCancel}
            title="Cancel selection"
            aria-label="Cancel selection"
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
        onChange={handleFileChange}
      />

      {/* Action buttons */}
      {selectedFile ? (
        <div className="flex items-center gap-2">
          <LoadingButton
            type="button"
            isLoading={isPending}
            loadingText="Saving..."
            onClick={handleSave}
            className="flex items-center gap-1.5 rounded-xl bg-brand px-4 py-2 font-heading text-xs font-bold text-white shadow-md shadow-brand/25 transition-all hover:-translate-y-0.5"
          >
            <Upload className="h-3.5 w-3.5" />
            Save Picture
          </LoadingButton>

          <button
            type="button"
            onClick={handleCancel}
            disabled={isPending}
            className="rounded-xl border border-line bg-surface px-3 py-2 font-heading text-xs font-semibold text-ink-muted transition-colors hover:text-ink disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      ) : hasCustomImage ? (
        <button
          type="button"
          onClick={handleRemove}
          disabled={isPending}
          className="inline-flex items-center gap-1.5 font-heading text-xs font-semibold text-ink-muted transition-colors hover:text-red-500 disabled:opacity-50"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Remove photo
        </button>
      ) : null}

      {/* Helper / Error text */}
      {clientError ? (
        <p role="alert" className="text-xs font-medium text-red-500">
          {clientError}
        </p>
      ) : (
        <p className="font-text text-xs text-ink-muted">
          JPG, PNG or WEBP · Max 2 MB
        </p>
      )}
    </div>
  )
}
