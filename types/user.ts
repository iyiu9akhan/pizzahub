export type UserRole = "admin" | "vendor" | "customer"

export interface ManagedUser {
  id: string
  name: string
  email: string
  image: string | null
  role: UserRole
  restricted: boolean
  emailVerified: boolean
  joinedAt: string
}