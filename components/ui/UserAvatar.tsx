
"use client"

import { useState } from "react"

export const DUMMY_AVATAR = "https://example.com/image.png"

export const ROLE_DEFAULT_AVATARS: Record<string, string> = {
  customer: "/images/avatars/default-customer.svg",
  vendor: "/images/avatars/default-vendor.svg",
  admin: "/images/avatars/default-admin.svg",
}

export const DEFAULT_AVATAR = ROLE_DEFAULT_AVATARS.customer

/**
 * Resolves an avatar URL.
 * Returns the provided image if it is a valid URL.
 * Returns the role's default SVG if image is null, empty,
 * or the legacy dummy placeholder.
 */
export function resolveAvatar(
  image?: string | null,
  role?: string | null,
): string {
  if (
    !image ||
    typeof image !== "string" ||
    !image.trim() ||
    image.trim() === DUMMY_AVATAR
  ) {
    const normalizedRole = (role || "").toLowerCase().trim()

    return ROLE_DEFAULT_AVATARS[normalizedRole] || DEFAULT_AVATAR
  }

  return image.trim()
}

// Avatar sizes
const SIZE_MAP = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-14 w-14",
}

export interface UserAvatarProps {
  name?: string
  image?: string | null
  src?: string | null
  role?: string | null
  size?: "sm" | "md" | "lg"
  className?: string
}

// Reusable avatar component
export default function UserAvatar({
  name = "User",
  image,
  src,
  role,
  size = "md",
  className = "",
}: UserAvatarProps) {
  const rawImage = image ?? src

  const defaultFallback = resolveAvatar(null, role)
  const resolved = resolveAvatar(rawImage, role)

  const [prevRaw, setPrevRaw] = useState(rawImage)
  const [prevRole, setPrevRole] = useState(role)
  const [errored, setErrored] = useState(false)

  if (rawImage !== prevRaw || role !== prevRole) {
    setPrevRaw(rawImage)
    setPrevRole(role)
    setErrored(false)
  }

  const finalSrc = errored ? defaultFallback : resolved

  return (
    <div
      className={`relative shrink-0 overflow-hidden rounded-full border border-line bg-surface ${SIZE_MAP[size]} ${className}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={finalSrc}
        alt={name}
        referrerPolicy="no-referrer"
        onError={() => {
          if (!errored) {
            setErrored(true)
          }
        }}
        className="absolute inset-0 h-full w-full rounded-full object-cover object-center"
      />
    </div>
  )
}
