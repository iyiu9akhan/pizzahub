"use client"
import AuthLayout from "@/components/auth/AuthLayout"
import LoginForm from "@/components/auth/LoginForm"
import { LoginFormData } from "@/types/loginFormType"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toastSuccess, toastError } from "@/lib/toast"

export default function LoginPage() {
  // const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

 const handleLogin = async (formData: LoginFormData) => {
    setIsLoading(true)
    try {
      const { error } = await authClient.signIn.email({
        email: formData.email,
        password: formData.password,
        rememberMe: formData.rememberMe,
      })

      if (error) {
        const isBanned =
          (error as { code?: string })?.code === "BANNED_USER" ||
          error.message?.toLowerCase().includes("banned") ||
          error.message?.toLowerCase().includes("restrict")
        const title = isBanned ? "Account Restricted" : "Login failed"
        toastError(title, error.message || "Invalid email or password.")
        return
      }

      toastSuccess("Logged in. Welcome back!")
      window.location.replace("/")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout
      image="/images/auth/login.jpg"
      quoteHeadline="Fresh bites, delivered hot."
      quoteSubtext="Real ingredients. Bolder flavors. Order your favorite pizza in minutes."
    >
      <LoginForm onSubmit={handleLogin} isLoading={isLoading} />
    </AuthLayout>
  )
}
