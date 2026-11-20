"use client"
import AuthLayout from "@/components/auth/AuthLayout"
import LoginForm from "@/components/auth/LoginForm"
import { LoginFormData } from "@/types/loginFormType"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toastSuccess, toastError } from "@/lib/toast"

// Login page — handles email/password sign-in and redirects on success
export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (formData: LoginFormData) => {
    setIsLoading(true)
    try {
      const { error } = await authClient.signIn.email({
        email: formData.email,
        password: formData.password,
        rememberMe: formData.rememberMe,
        callbackURL: "/",
      })

      if (error) {
        // Show descriptive error toast instead of alert()
        toastError("Login failed", error.message || "Invalid email or password.")
        return
      }

      toastSuccess("Logged in. Welcome back!")
      router.push("/")
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
      {/* Pass isLoading down so the submit button shows a spinner */}
      <LoginForm onSubmit={handleLogin} isLoading={isLoading} />
    </AuthLayout>
  )
}
