// UserAvatar — reusable round avatar with fallback to a default profile image.
// If `src` is null/empty or the image fails to load, shows the default profile picture.
// Never persists the default image to the database — UI-only fallback.
"use client"

import { useState } from "react"

// Size classes for the avatar
const SIZE_MAP = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-14 w-14",
}

// Default fallback image path
const DEFAULT_AVATAR = "/images/profilePic/profile-demo.png"

interface UserAvatarProps {
  src?: string | null
  name?: string
  size?: "sm" | "md" | "lg"
  /** Override the default fallback image path */
  fallbackSrc?: string
  className?: string
}

// Reusable avatar component used in navbar, sidebar, and profile pages
export default function UserAvatar({
  src,
  name = "User",
  size = "md",
  fallbackSrc = DEFAULT_AVATAR,
  className = "",
}: UserAvatarProps) {
  // Track previous src to reset errored state on change
  const [prevSrc, setPrevSrc] = useState(src)
  const [errored, setErrored] = useState(false)

  if (src !== prevSrc) {
    setPrevSrc(src)
    setErrored(false)
  }

  // Use fallback if src is absent or image errored
  const resolvedSrc = src && !errored ? src : fallbackSrc

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={resolvedSrc}
      alt={name}
      onError={() => setErrored(true)}
      className={`${SIZE_MAP[size]} shrink-0 rounded-full border border-line object-cover ${className}`}
    />
  )
}
