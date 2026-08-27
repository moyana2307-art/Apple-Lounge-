import Hero from '@/components/Hero';
import FeaturedProducts from '@/components/FeaturedProducts';
import SamsungSection from '@/components/SamsungSection';
import ShopByModel from '@/components/ShopByModel';
import AccessoriesSection from '@/components/AccessoriesSection';
import BrandStatement from '@/components/BrandStatement';
import WhyChooseUs from '@/components/WhyChooseUs';
import LatestDeals from '@/components/LatestDeals';
import WhatsAppCTA from '@/components/WhatsAppCTA';

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedProducts />
      <SamsungSection />
      <ShopByModel />
      <AccessoriesSection />
      <BrandStatement />
      <WhyChooseUs />
      <LatestDeals />
      <WhatsAppCTA />
    </>
  );
}
