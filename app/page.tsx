import Navbar from "@/components/header/navbar/Navbar"
import Banner from "@/components/banner/Banner"
import FeatureMenu from "@/components/feature-menu/FeatureMenu"

export default function Home() {
  return (
    <div className="min-h-screen bg-page flex flex-col transition-colors duration-300">
      <Navbar />
      <main className="flex-1">
        <Banner />
        <FeatureMenu />
      </main>
    </div>
  )
}
