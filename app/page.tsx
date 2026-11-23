export const dynamic = "force-dynamic"
import Navbar from "@/components/header/navbar/Navbar"
import HeroBanner from "@/components/home/HeroBanner"
import FeatureMenu from "@/components/feature-menu/FeatureMenu"
import PizzaCategories from "@/components/home/PizzaCategories"
import WhyChooseUs from "@/components/home/WhyChooseUs"
import HowItWorks from "@/components/home/HowItWorks"
import Footer from "@/components/home/Footer"
import { getHeaderOrderCount } from "@/lib/core/server"

export default async function Home() {
  let orderCount = 0
  try {
    orderCount = await getHeaderOrderCount()
  } catch (error) {
    console.error("Header order count failed:", error)
  }

  return (
    <div className="flex min-h-screen flex-col bg-page transition-colors duration-300">
      {/* <Navbar orderCount={orderCount} /> */}
      <main className="flex-1">
        <HeroBanner />
        <FeatureMenu />
        <PizzaCategories />
        <WhyChooseUs />
        <HowItWorks />
      </main>
      <Footer />
    </div>
  )
}
