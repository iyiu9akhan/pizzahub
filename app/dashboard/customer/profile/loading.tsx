import React from "react"
import { ProfileSkeleton } from "@/components/dashboard/profile/ProfileSettingsForm"

export default function CustomerProfileLoading() {
  return (
    <div className="w-full p-4 sm:p-6 lg:p-8">
      <ProfileSkeleton />
    </div>
  )
}
