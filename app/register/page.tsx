"use client"
import AuthLayout from "@/components/auth/AuthLayout"
import RegisterForm from "@/components/auth/RegisterForm"
import { RegisterFormData } from "@/types/registerDataType"
import { authClient } from "@/lib/auth-client"

export default function RegisterPage() {
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
      return
    }

    console.log("new user from formData:", formData)
    console.log("new user from authData:", authData)
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
