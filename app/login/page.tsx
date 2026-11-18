import type { Metadata } from "next"
import AuthLayout from "@/components/auth/AuthLayout"
import LoginForm from "@/components/auth/LoginForm"

export const metadata: Metadata = {
  title: "Login - PizzaHub",
  description: "Login to your PizzaHub account to order fresh, delicious pizza fast.",
}

export default function LoginPage() {
  return (
    <AuthLayout
      image="/images/auth/login.jpg"
      quoteHeadline="Fresh bites, delivered hot."
      quoteSubtext="Real ingredients. Bolder flavors. Order your favorite pizza in minutes."
    >
      <LoginForm />
    </AuthLayout>
  )
}
