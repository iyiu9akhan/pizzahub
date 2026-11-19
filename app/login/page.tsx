"use client"
import AuthLayout from "@/components/auth/AuthLayout"
import LoginForm from "@/components/auth/LoginForm"
import { LoginFormData } from "@/types/loginFormType" 
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const router = useRouter()

  const handleLogin = async (formData: LoginFormData) => {
    const { data, error } = await authClient.signIn.email({
      email: formData.email,
      password: formData.password,
      rememberMe: formData.rememberMe,
      callbackURL: "/",
    })

    if (error) {
      console.error("Login error:", error)
      alert(error.message || "Failed to login")
      return
    }

    console.log("Login Success:", data)
    router.push("/")
  }

  return (
    <AuthLayout
      image="/images/auth/login.jpg"
      quoteHeadline="Fresh bites, delivered hot."
      quoteSubtext="Real ingredients. Bolder flavors. Order your favorite pizza in minutes."
    >
      <LoginForm onSubmit={handleLogin} />
    </AuthLayout>
  )
}