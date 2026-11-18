import React from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Tag } from "lucide-react"
import BrandLogo from "@/components/header/navbar/brandLogo/BrandLogo"

export interface AuthLayoutProps {
  children: React.ReactNode
  image: string
  quoteHeadline: string
  quoteSubtext?: string
  badgeText?: string
  isRegister?: boolean
  className?: string
}

const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  image,
  quoteHeadline,
  badgeText,
  isRegister = false,
  className = "",
}) => {
  return (
    <main
      className={`min-h-screen w-full bg-page px-4 py-6 transition-colors duration-300 sm:px-6 sm:py-10 ${className}`}
    >
      <div className="mx-auto w-full max-w-5xl">
        {/* Top bar */}
        <div className="mb-5 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-full border border-line bg-surface px-4 font-heading text-sm font-semibold text-ink transition-colors hover:border-brand hover:text-brand-fg focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-brand/40"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
        </div>

        {/* Card */}
        <div className="grid overflow-hidden rounded-3xl border border-line bg-surface shadow-2xl shadow-black/5 lg:grid-cols-2">
          {/* ───────── LEFT: visual ───────── */}
          {isRegister ? (
            <div className="relative hidden min-h-[720px] overflow-hidden bg-[#e8decb] lg:block">
              <Image
                src={image}
                alt="The Anatomy of Pizza"
                fill
                priority
                unoptimized
                className="object-cover object-center"
              />

              {/* Top-left BrandLogo pill (adapts to light/dark theme via bg-surface) */}
              <div className="relative z-10 p-6">
                <div className="inline-block rounded-2xl border border-line/50 bg-surface/95 px-4 py-2.5 shadow-lg backdrop-blur-md">
                  <BrandLogo />
                </div>
              </div>

              {/* Bottom-left Discount Badge (forced dark text on white pill) */}
              {badgeText && (
                <div className="absolute bottom-6 left-6 z-10 flex items-center gap-2.5 rounded-2xl bg-white/95 px-4 py-2.5 text-zinc-900 shadow-xl backdrop-blur-md">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                    <Tag className="h-4 w-4" />
                  </span>
                  <span className="font-heading text-sm font-bold text-zinc-900">
                    {badgeText}
                  </span>
                </div>
              )}
            </div>
          ) : (
            /* Login: poster (text already inside the image) */
            <div className="relative hidden min-h-[640px] bg-[#f3e9d8] lg:block">
              <Image
                src={image}
                alt={quoteHeadline}
                fill
                priority
                unoptimized
                className="object-cover object-center"
              />
            </div>
          )}

          {/* ───────── RIGHT: form ───────── */}
          <div className="flex flex-col justify-center p-6 sm:p-10 lg:p-12">
            {!isRegister && (
              <div className="mb-8">
                <BrandLogo />
              </div>
            )}
            {isRegister && (
              <div className="mb-6 lg:hidden">
                <BrandLogo />
              </div>
            )}
            {children}
          </div>
        </div>
      </div>
    </main>
  )
}

export default AuthLayout