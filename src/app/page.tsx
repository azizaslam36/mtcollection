import { Hero } from "@/components/hero/Hero";
import { FeaturedCategories } from "@/components/sections/FeaturedCategories";
import { TrendingProducts } from "@/components/sections/TrendingProducts";
import { SeasonalCollection } from "@/components/sections/SeasonalCollection";
import { FeaturedDeals } from "@/components/sections/FeaturedDeals";
import { WhyMt } from "@/components/sections/WhyMt";
import { FinalCta } from "@/components/sections/FinalCta";

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedCategories />
      <TrendingProducts />
      <SeasonalCollection />
      <FeaturedDeals />
      <WhyMt />
      <FinalCta />
    </>
  );
}
