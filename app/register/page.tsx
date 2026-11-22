"use client"

import AuthLayout from "@/components/auth/AuthLayout"
import RegisterForm from "@/components/auth/RegisterForm"
import { RegisterFormData } from "@/types/registerDataType"
import { authClient } from "@/lib/auth-client"
import { setSignupRole } from "@/lib/actions/SetSignupRole"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toastSuccess, toastError } from "@/lib/toast"

// Register page — creates a new user account via Better Auth
export default function RegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleRegisterSubmit = async (formData: RegisterFormData) => {
    setIsLoading(true)
    try {
      // role signup e pathano jabe na (admin() plugin block kore)
      const { error } = await authClient.signUp.email({
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
        callbackURL: "/",
      })

      if (error) {
        // Show error toast instead of alert()
        toastError("Registration failed", error.message || "Could not create account.")
        return
      }

      // Signup er por role set (sudhu customer / vendor, admin kokhono na)
      await setSignupRole(formData.role as "customer" | "vendor")

      toastSuccess("Account created! Welcome to PizzaHub.")
      router.push("/")
      router.refresh()
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout
      isRegister
      image="/images/auth/register.jpg"
      quoteHeadline="Hungry? Let's get started."
      quoteSubtext="Sign up now to explore artisanal fresh pizzas and exclusive daily rewards."
      badgeText="Get 20% OFF on your first order"
    >
      <RegisterForm onSubmit={handleRegisterSubmit} isLoading={isLoading} />
    </AuthLayout>
  )
}