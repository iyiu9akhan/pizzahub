// Re-export shared ProfileImageUploader for profile settings.
"use client"

import ProfileImageUploader, {
  ProfileImageUploaderProps,
} from "@/components/dashboard/shared/ProfileImageUploader"

export type { ProfileImageUploaderProps }
export default ProfileImageUploader
