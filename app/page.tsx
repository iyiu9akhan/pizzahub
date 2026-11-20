// Landing Home page — hero, featured menu, categories, benefits, how-it-works, footer.
import Navbar from "@/components/header/navbar/Navbar"
import HeroBanner from "@/components/home/HeroBanner"
import FeatureMenu from "@/components/feature-menu/FeatureMenu"
import PizzaCategories from "@/components/home/PizzaCategories"
import WhyChooseUs from "@/components/home/WhyChooseUs"
import HowItWorks from "@/components/home/HowItWorks"
import Footer from "@/components/home/Footer"

export default function Home() {
  return (
    <div className="min-h-screen bg-page flex flex-col transition-colors duration-300">
      <Navbar />
      <main className="flex-1">
        {/* 1. Hero banner */}
        <HeroBanner />
        {/* 2. Featured menu items — dynamic, keep as-is */}
        <FeatureMenu />
        {/* 3. Browse by category */}
        <PizzaCategories />
        {/* 4. Why choose PizzaHub */}
        <WhyChooseUs />
        {/* 5. How it works */}
        <HowItWorks />
      </main>
      {/* 6. Footer */}
      <Footer />
    </div>
  )
}
