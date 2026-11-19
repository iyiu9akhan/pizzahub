"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Mail, Lock, User, Phone, Eye, EyeOff } from "lucide-react"
import SocialButtons from "@/components/auth/SocialButtons"
import Checkbox from "@/components/ui/Checkbox"
import RoleSelect from "@/components/auth/RoleSelect"
import { UserRole } from "@/types/auth"
import { RegisterFormData, RegisterFormProps } from "@/types/registerDataType"

const inputBase =
  "h-11 sm:h-12 w-full rounded-xl border border-line bg-surface pl-11 pr-4 font-text text-sm text-ink placeholder:text-ink-muted/60 transition-all focus:border-brand focus:outline-hidden focus:ring-2 focus:ring-brand/20"

const labelBase =
  "block font-heading text-xs sm:text-sm font-semibold text-ink mb-1"

const iconWrap =
  "pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-ink-muted"

const eyeBtn =
  "absolute inset-y-0 right-0 flex items-center pr-3.5 text-ink-muted hover:text-ink transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-brand/40 rounded-lg cursor-pointer"

const RegisterForm: React.FC<RegisterFormProps> = ({
  className = "",
  onSubmit,
}) => {
  const [role, setRole] = useState<UserRole>("customer")
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false)

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (onSubmit) {
      onSubmit({
        role,
        ...formData,
      })
    }
  }

  return (
    <div className={`w-full ${className}`}>
      <div>
        <h1 className="font-heading text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
          Create your account
        </h1>
        <p className="mt-1.5 font-text text-sm text-ink-muted sm:text-base">
          Sign up and get your first pizza deal.
        </p>
      </div>

      <div className="mt-5">
        <RoleSelect selectedRole={role} onChange={setRole} />
      </div>

      <form onSubmit={handleSubmit} className="mt-5 space-y-3">
        {/* Full Name */}
        <div>
          <label htmlFor="reg-name" className={labelBase}>
            Full name
          </label>
          <div className="relative">
            <div className={iconWrap}>
              <User className="h-5 w-5" />
            </div>
            <input
              id="reg-name"
              name="fullName"
              type="text"
              required
              value={formData.fullName}
              onChange={handleChange}
              placeholder="John Doe"
              className={inputBase}
            />
          </div>
        </div>

        {/* Email */}
        <div className="">
          <label htmlFor="reg-email" className={labelBase}>
            Email address
          </label>
          <div className="relative">
            <div className={iconWrap}>
              <Mail className="h-5 w-5" />
            </div>
            <input
              id="reg-email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="name@example.com"
              className={inputBase}
            />
          </div>
        </div>

       {/* password input  */}
        <div className="mb-3">
          <label htmlFor="reg-password" className={labelBase}>
            Password
          </label>
          <div className="relative">
            <div className={iconWrap}>
              <Lock className="h-5 w-5" />
            </div>
            <input
              id="reg-password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a strong password"
              className={`${inputBase} pr-11`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className={eyeBtn}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Confirm Password input*/}
        <div>
          <label htmlFor="reg-confirm-password" className={labelBase}>
            Confirm password
          </label>
          <div className="relative">
            <div className={iconWrap}>
              <Lock className="h-5 w-5" />
            </div>
            <input
              id="reg-confirm-password"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              className={`${inputBase} pr-11`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              aria-label={
                showConfirmPassword ? "Hide password" : "Show password"
              }
              className={eyeBtn}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Terms */}
        <div className="pt-1.5">
          <Checkbox
            id="reg-terms"
            checked={formData.agreeTerms}
            onChange={(checked) =>
              setFormData((prev) => ({ ...prev, agreeTerms: checked }))
            }
            required
            label={
              <span>
                I agree to the{" "}
                <Link
                  href="#"
                  className="cursor-pointer rounded-xs font-heading font-semibold text-brand-fg hover:underline focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:outline-hidden"
                >
                  Terms of Service
                </Link>{" "}
                &{" "}
                <Link
                  href="#"
                  className="cursor-pointer rounded-xs font-heading font-semibold text-brand-fg hover:underline focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:outline-hidden"
                >
                  Privacy Policy
                </Link>
              </span>
            }
          />
        </div>

        <button
          type="submit"
          className="mt-3 h-11 w-full cursor-pointer rounded-xl bg-brand font-heading text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:bg-brand-dark hover:shadow-md focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:outline-hidden active:scale-[0.99] sm:h-12 sm:text-base"
        >
          Create Account
        </button>
      </form>

      <div className="relative my-5">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-line" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-surface px-3 font-text text-ink-muted">or</span>
        </div>
      </div>

      <SocialButtons label="Sign up with Google" />

      <p className="mt-6 text-center font-text text-sm text-ink-muted">
        Already have an account?{" "}
        <Link
          href="/login"
          className="cursor-pointer rounded-sm font-heading font-bold text-brand-fg underline-offset-4 transition-colors hover:text-brand-dark hover:underline focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:outline-hidden"
        >
          Login
        </Link>
      </p>
    </div>
  )
}

export default RegisterForm
