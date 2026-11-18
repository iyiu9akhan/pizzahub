import { UserRole } from "@/types/auth"

export interface RegisterFormData {
  role: UserRole
  fullName: string
  email: string
  phone: string
  password: string
  confirmPassword: string
  agreeTerms: boolean
}

export interface RegisterFormProps {
  className?: string
  onSubmit?: (data: RegisterFormData) => void
}