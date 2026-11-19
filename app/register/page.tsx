"use client"

import AuthLayout from "@/components/auth/AuthLayout"
import RegisterForm from "@/components/auth/RegisterForm"
import { RegisterFormData } from "@/types/registerDataType"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation" // <--- 1. Import useRouter

export default function RegisterPage() {
  const router = useRouter() 

  const handleRegisterSubmit = async (formData: RegisterFormData) => {
    const { data: authData, error } = await authClient.signUp.email({
      name: formData.fullName,
      email: formData.email,
      password: formData.password,
      image: "https://example.com/image.png",
      callbackURL: "/",
      fetchOptions: {
        body: {
          role: formData.role,
        },
      },
    })

    if (error) {
      console.error("Sign up error:", error)
      alert(error.message || "Failed to register")
      return
    }

    console.log("new user from formData:", formData)
    console.log("new user from authData:", authData)
    
    router.push("/")
    router.refresh()
  }

  return (
    <AuthLayout
      isRegister
      image="/images/auth/register.jpg"
      quoteHeadline="Hungry? Let's get started."
      quoteSubtext="Sign up now to explore artisanal fresh pizzas and exclusive daily rewards."
      badgeText="Get 20% OFF on your first order"
    >
      <RegisterForm onSubmit={handleRegisterSubmit} />
    </AuthLayout>
  )
}