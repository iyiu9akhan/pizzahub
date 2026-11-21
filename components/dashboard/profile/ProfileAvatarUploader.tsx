// Shared ProfileAvatarUploader component.
// Used across Admin, Vendor, and Customer profile pages to change the profile picture.
// Validates image file type and size, uploads via /api/upload, and updates user image with Better Auth.
"use client"

import React, { useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Camera, Upload, X } from "lucide-react"

import { authClient } from "@/lib/auth-client"
import { toastSuccess, toastError } from "@/lib/toast"
import LoadingButton from "@/components/ui/LoadingButton"
import UserAvatar from "@/components/ui/UserAvatar"

// Allowed image MIME types and maximum file size (5MB)
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"]
const MAX_IMAGE_SIZE = 5 * 1024 * 1024 // 5 MB

interface ProfileAvatarUploaderProps {
  currentImage?: string | null
  userName?: string
  onImageUpdated?: (newImageUrl: string) => void
  className?: string
}

export default function ProfileAvatarUploader({
  currentImage,
  userName = "User",
  onImageUpdated,
  className = "",
}: ProfileAvatarUploaderProps) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  // Validate and stage file
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!ALLOWED_TYPES.includes(file.type)) {
      setErrorMsg("Only JPG, PNG, or WEBP images are allowed.")
      return
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setErrorMsg("Image must be smaller than 5 MB.")
      return
    }

    setErrorMsg("")
    setSelectedFile(file)
    setPreviewUrl(URL.createObjectURL(file))
  }

  // Clear staged file
  const handleCancel = () => {
    setSelectedFile(null)
    setPreviewUrl(null)
    setErrorMsg("")
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  // Upload to /api/upload and update user profile in Better Auth
  const handleUpload = async () => {
    if (!selectedFile) return
    setIsUploading(true)
    setErrorMsg("")

    try {
      const formData = new FormData()
      formData.append("file", selectedFile)

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      const data = await res.json()
      if (!res.ok || !data.url) {
        throw new Error(data.error || "Image upload failed")
      }

      const imageUrl = data.url as string

      // Update Better Auth user image
      const { error } = await authClient.updateUser({
        image: imageUrl,
      })

      if (error) {
        throw new Error(error.message || "Failed to update profile image")
      }

      // Bypass cookie cache to immediately refresh session state in client components
      try {
        await (authClient.getSession as (opts: unknown) => Promise<unknown>)({
          query: { disableCookieCache: true },
        })
      } catch {
        // Fallback session refresh
      }

      toastSuccess("Profile picture updated.")
      onImageUpdated?.(imageUrl)
      handleCancel()
      router.refresh()
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to update photo."
      setErrorMsg(message)
      toastError("Upload failed", message)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      {/* Avatar with Camera Trigger */}
      <div className="relative">
        {previewUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={previewUrl}
            alt="Profile preview"
            className="h-28 w-28 rounded-full border-4 border-line object-cover"
          />
        ) : (
          <UserAvatar
            src={currentImage}
            name={userName}
            size="lg"
            className="h-28 w-28 border-4 border-line"
          />
        )}

        {/* Change Photo Trigger */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          title="Change profile picture"
          aria-label="Change profile picture"
          disabled={isUploading}
          className="absolute bottom-1 right-1 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-brand text-white shadow-md transition-transform hover:scale-110 disabled:opacity-50"
        >
          <Camera className="h-4 w-4" />
        </button>

        {/* Cancel selected preview */}
        {previewUrl && !isUploading && (
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

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="sr-only"
        onChange={handleFileChange}
      />

      {/* Action button when new image is staged */}
      {selectedFile && (
        <div className="flex items-center gap-2">
          <LoadingButton
            type="button"
            isLoading={isUploading}
            loadingText="Uploading..."
            onClick={handleUpload}
            className="flex items-center gap-1.5 rounded-xl bg-brand px-4 py-2 font-heading text-xs font-bold text-white shadow-md shadow-brand/25 transition-all hover:-translate-y-0.5"
          >
            <Upload className="h-3.5 w-3.5" />
            Save Picture
          </LoadingButton>

          <button
            type="button"
            onClick={handleCancel}
            disabled={isUploading}
            className="rounded-xl border border-line bg-surface px-3 py-2 font-heading text-xs font-semibold text-ink-muted transition-colors hover:text-ink disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Error / Helper text */}
      {errorMsg ? (
        <p role="alert" className="text-xs text-red-500 font-medium">
          {errorMsg}
        </p>
      ) : (
        <p className="font-text text-xs text-ink-muted">
          JPG, PNG or WEBP · Max 5 MB
        </p>
      )}
    </div>
  )
}
