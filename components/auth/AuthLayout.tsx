import React from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Tag } from "lucide-react"
import BrandLogo from "@/components/header/navbar/brandLogo/BrandLogo"

export interface AuthLayoutProps {
  children: React.ReactNode
  image: string
  quoteHeadline: string
  quoteSubtext: string
  badgeText?: string
  isRegister?: boolean
  className?: string
}

const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  image,
  quoteHeadline,
  quoteSubtext,
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
          {/* TODO: tomar ager moon-icon theme toggle component ekhane boshao */}
        </div>

        {/* Card */}
        <div className="grid overflow-hidden rounded-3xl border border-line bg-surface shadow-2xl shadow-black/5 lg:grid-cols-2">
          {/* ───────── LEFT: visual ───────── */}
          {isRegister ? (
            <div className="relative hidden min-h-[720px] flex-col overflow-hidden bg-brand text-white lg:flex">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-white/10 blur-3xl"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-black/20 blur-3xl"
              />

              <div className="relative z-10 p-10 pb-0">
                <BrandLogo isLight />
                <h2 className="mt-8 font-heading text-3xl font-extrabold leading-tight tracking-tight xl:text-4xl">
                  {quoteHeadline}
                </h2>
                <p className="mt-3 max-w-sm font-text text-sm leading-relaxed text-white/85">
                  {quoteSubtext}
                </p>
              </div>

              <div className="relative z-10 mt-4 flex-1">
                <div
                  aria-hidden="true"
                  className="absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/10"
                />
                <Image
                  src={image}
                  alt="Pizza slice with melted cheese and pepperoni"
                  fill
                  priority
                  unoptimized
                  className="scale-[1.3] object-contain drop-shadow-2xl"
                />

                {badgeText && (
                  <div className="absolute bottom-6 left-10 flex items-center gap-2.5 rounded-2xl bg-white px-4 py-2.5 text-ink shadow-xl">
                    <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-soft text-brand-fg">
                      <Tag className="h-4 w-4" />
                    </span>
                    <span className="font-heading text-sm font-bold">{badgeText}</span>
                  </div>
                )}
              </div>
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