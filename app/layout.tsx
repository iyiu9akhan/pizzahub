import type { Metadata } from "next"
import { Montserrat, Quicksand } from "next/font/google"
import "./globals.css"
import { cn } from "@/lib/utils"
import { Toaster } from "sonner"

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["500", "600", "700", "800"],
  display: "swap",
})

const quicksand = Quicksand({
  subsets: ["latin"],
  variable: "--font-quicksand",
  weight: ["400", "500", "600", "700"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "PizzaHub - Fresh, Natural, Delivered Fast",
  description:
    "Freshly baked artisan pizzas with premium organic ingredients, delivered hot to your door in minutes.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(montserrat.variable, quicksand.variable, "antialiased")}
    >
      <head>
        {/* Inline script: apply saved theme before first paint to prevent flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var s=localStorage.getItem("pizzahub-theme");var d=s==="dark"||(!s&&window.matchMedia("(prefers-color-scheme: dark)").matches);if(d){document.documentElement.classList.add("dark")}else{document.documentElement.classList.remove("dark")}}catch(e){}})()`,
          }}
        />
      </head>
      <body
        className={cn(
          montserrat.variable,
          quicksand.variable,
          "min-h-screen bg-page text-ink antialiased selection:bg-brand-soft selection:text-brand-fg transition-colors duration-300"
        )}
      >
        {children}

        {/* Global toast notifications — card style, top-center, light and dark mode */}
        <Toaster
          position="top-center"
          closeButton
          theme="system"
          toastOptions={{
            duration: 4000,
            classNames: {
              toast:
                "font-text !rounded-2xl !border !border-line !bg-surface !shadow-xl !shadow-black/10 !px-4 !py-3.5 !gap-3 !items-start",
              title: "font-heading !font-semibold !text-ink !text-sm",
              description: "font-text !text-ink-muted !text-xs !leading-relaxed",
              closeButton:
                "!border !border-line !bg-surface !text-ink-muted !rounded-full hover:!bg-brand-soft hover:!text-brand-fg",
              success:
                "!border-l-4 !border-l-[#106033] [&>[data-icon]]:!text-[#106033]",
              error:
                "!border-l-4 !border-l-[#AF0000] [&>[data-icon]]:!text-[#AF0000]",
              warning:
                "!border-l-4 !border-l-amber-500 [&>[data-icon]]:!text-amber-500",
              info:
                "!border-l-4 !border-l-blue-500 [&>[data-icon]]:!text-blue-500",
            },
          }}
        />
      </body>
    </html>
  )
}
