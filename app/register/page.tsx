import type { Metadata } from "next"
import AuthLayout from "@/components/auth/AuthLayout"
import RegisterForm from "@/components/auth/RegisterForm"

export const metadata: Metadata = {
  title: "Sign Up - PizzaHub",
  description: "Create an account on PizzaHub and get 20% OFF on your first order.",
}

export default function RegisterPage() {
  return (
    <AuthLayout
      isRegister
      image="/images/auth/register.jpg"
      quoteHeadline="Hungry? Let's get started."
      quoteSubtext="Sign up now to explore artisanal fresh pizzas and exclusive daily rewards."
      badgeText="Get 20% OFF on your first order"
    >
      <RegisterForm />
    </AuthLayout>
  )
}
