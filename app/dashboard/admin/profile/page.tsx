"use client"
import { useSession } from "@/lib/auth-client"
import ProfileSettingsForm, { ProfileSkeleton } from "@/components/dashboard/profile/ProfileSettingsForm"

export default function AdminProfilePage() {
  const { data: session, isPending } = useSession()

  if (isPending || !session?.user) return <ProfileSkeleton />
  
  const user = {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
    image: session.user.image,
    role: (session.user as Record<string, unknown>).role as string | undefined,
  }

  return (
    <div className="w-full p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-bold tracking-tight text-ink sm:text-3xl">
          Profile Settings
        </h1>
        <p className="mt-2 text-sm text-ink-muted">
          Update your administrator profile details.
        </p>
      </div>

      <ProfileSettingsForm key={user.id} user={user} />
    </div>
  )
}
