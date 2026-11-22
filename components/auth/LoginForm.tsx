// Login form component — email, password, remember me, and Google sign-in button.
// Accepts isLoading from parent to show spinner while the API call is in flight.
"use client"

import React, { useState } from "react"
import Link from "next/link"
import { z } from "zod"
import { Mail, Lock, Eye, EyeOff } from "lucide-react"
import SocialButtons from "@/components/auth/SocialButtons"
import Checkbox from "@/components/ui/Checkbox"
import type { LoginFormProps } from "@/types/loginFormType"
import LoadingButton from "@/components/ui/LoadingButton"

const loginSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

// Extended props: add isLoading for the spinner
interface LoginFormExtendedProps extends LoginFormProps {
  isLoading?: boolean
}

const LoginForm: React.FC<LoginFormExtendedProps> = ({
  className = "",
  onSubmit,
  isLoading = false,
}) => {
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [rememberMe, setRememberMe] = useState<boolean>(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})

  // Collect form values and bubble up to parent handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const result = loginSchema.safeParse({ email, password })
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors
      setErrors({
        email: fieldErrors.email?.[0],
        password: fieldErrors.password?.[0],
      })
      return
    }

    setErrors({})
    if (onSubmit) {
      onSubmit({ email, password, rememberMe })
    }
  }

  return (
    <div className={`w-full ${className}`}>
      <div>
        <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
          Welcome back
        </h1>
        <p className="mt-1.5 font-text text-sm sm:text-base text-ink-muted">
          Login to order your favorite pizza.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-7 space-y-4">
        {/* Email Input */}
        <div>
          <label
            htmlFor="login-email"
            className="block font-heading text-xs sm:text-sm font-semibold text-ink mb-1.5"
          >
            Email address
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-ink-muted">
              <Mail className="h-5 w-5" />
            </div>
            <input
              id="login-email"
              type="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }))
              }}
              placeholder="name@example.com"
              disabled={isLoading}
              className={`h-12 w-full rounded-xl border bg-surface pl-11 pr-4 font-text text-sm text-ink placeholder:text-ink-muted/60 transition-all focus:border-brand focus:outline-hidden focus:ring-2 focus:ring-brand/20 disabled:opacity-60 ${
                errors.email ? "border-red-500" : "border-line"
              }`}
            />
          </div>
          {errors.email && (
            <p className="mt-1 font-text text-xs text-red-500">{errors.email}</p>
          )}
        </div>

        {/* Password Input */}
        <div>
          <label
            htmlFor="login-password"
            className="block font-heading text-xs sm:text-sm font-semibold text-ink mb-1.5"
          >
            Password
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-ink-muted">
              <Lock className="h-5 w-5" />
            </div>
            <input
              id="login-password"
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }))
              }}
              placeholder="Enter your password"
              disabled={isLoading}
              className={`h-12 w-full rounded-xl border bg-surface pl-11 pr-11 font-text text-sm text-ink placeholder:text-ink-muted/60 transition-all focus:border-brand focus:outline-hidden focus:ring-2 focus:ring-brand/20 disabled:opacity-60 ${
                errors.password ? "border-red-500" : "border-line"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-ink-muted hover:text-ink transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-brand/40 rounded-lg cursor-pointer"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 font-text text-xs text-red-500">{errors.password}</p>
          )}
        </div>

        <div className="flex items-center justify-between pt-1 text-xs sm:text-sm">
          <Checkbox
            id="remember-me"
            label="Remember me"
            checked={rememberMe}
            onChange={setRememberMe}
          />
          />
          <Link
            href="#"
            className="font-heading font-semibold text-brand-fg hover:text-brand-dark transition-colors text-xs sm:text-sm focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-brand/40 rounded-sm cursor-pointer"
          >
            Forgot password?
          </Link>
        </div>

        {/* Submit button with loading spinner */}
        <LoadingButton
          type="submit"
          isLoading={isLoading}
          loadingText="Logging in…"
          className="w-full h-12 rounded-xl bg-brand text-white font-heading font-semibold text-sm sm:text-base shadow-sm transition-all duration-300 hover:bg-brand-dark hover:shadow-md focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-brand/40 active:scale-[0.99] cursor-pointer mt-2"
        >
          Login
        </LoadingButton>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-line" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-surface px-3 font-text text-ink-muted">or</span>
        </div>
      </div>

      <SocialButtons label="Continue with Google" />

      <p className="mt-7 text-center font-text text-sm text-ink-muted">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="font-heading font-bold text-brand-fg hover:text-brand-dark transition-colors underline-offset-4 hover:underline focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-brand/40 rounded-sm cursor-pointer"
        >
          Sign up
        </Link>
      </p>
    </div>
  )
}

export default LoginForm
