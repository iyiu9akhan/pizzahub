import type { Metadata } from "next"
import { Montserrat, Quicksand } from "next/font/google"
import "./globals.css"
import { cn } from "@/lib/utils"

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
      </body>
    </html>
  )
}
