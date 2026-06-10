import { useEffect, useState } from "react";
import { CtaBanner } from "@/components/sections/cta-banner";
import { Footer } from "@/components/sections/footer";
import { GlobalCoverageSection } from "@/components/sections/global-coverage-section";
import { HeroSection } from "@/components/sections/hero-section";
import { Navbar } from "@/components/sections/navbar";
import { ServicesSection } from "@/components/sections/services-section";
import { StatsSection } from "@/components/sections/stats-section";
import { TestimonialsSection } from "@/components/sections/testimonials-section";
import { TrackingSection } from "@/components/sections/tracking-section";
import { WhyChooseSection } from "@/components/sections/why-choose-section";
import { AboutUsSection } from "@/components/sections/about-us-section";
import { LoadingScreen } from "@/components/animations/loading-screen";

export function LandingPage() {
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowLoader(false), 900);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <LoadingScreen show={showLoader} />
      <div className="relative">
        <Navbar />
        <HeroSection />
        <StatsSection />
        <AboutUsSection />
        <ServicesSection />
        {/* <TrackingSection /> */}
        <WhyChooseSection />
        <GlobalCoverageSection />
        <TestimonialsSection />
        {/* <CtaBanner /> */}
        <Footer />
      </div>
    </>
  );
}
