"use client"

import AuthLayout from "@/components/auth/AuthLayout"
import RegisterForm from "@/components/auth/RegisterForm"
import { RegisterFormData } from "@/types/registerDataType"
import { authClient } from "@/lib/auth-client"
import { setSignupRole } from "@/lib/actions/SetSignupRole"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toastSuccess, toastError } from "@/lib/toast"

export default function RegisterPage() {
  // const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleRegisterSubmit = async (formData: RegisterFormData) => {
    if (
      !formData.password ||
      formData.password.length < 6 ||
      !/[A-Z]/.test(formData.password) ||
      !/[a-z]/.test(formData.password)
    ) {
      toastError(
        "Registration failed",
        "Password must be at least 6 characters with at least 1 uppercase and 1 lowercase letter."
      )
      return
    }

    setIsLoading(true)
    try {
      const { error } = await authClient.signUp.email({
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
      })

      if (error) {
        toastError(
          "Registration failed",
          error.message || "Could not create account."
        )
        return
      }

      await setSignupRole(formData.role as "customer" | "vendor")

      toastSuccess("Account created! Welcome to PizzaHub.")
      window.location.replace("/")
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
