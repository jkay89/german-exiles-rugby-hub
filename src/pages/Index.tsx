
import { useState, useEffect } from "react";
import { getNextFixture, Fixture } from "@/utils/fixtureUtils";
import HeroSection from "@/components/home/HeroSection";
import MissionSection from "@/components/home/MissionSection";
import FeatureGrid from "@/components/home/FeatureGrid";
import SponsorCarousel from "@/components/home/SponsorCarousel";
import { sponsorData } from "@/data/sponsorData";

const Index = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [nextFixture, setNextFixture] = useState<Fixture | null>(null);

  useEffect(() => {
    setIsLoaded(true);
    
    // Properly handle the Promise returned by getNextFixture
    const fetchNextFixture = async () => {
      try {
        const fixture = await getNextFixture();
        setNextFixture(fixture);
      } catch (error) {
        console.error("Error fetching next fixture:", error);
        setNextFixture(null);
      }
    };
    
    fetchNextFixture();
  }, []);

  return (
    <div className="pt-16 min-h-screen bg-black">
      <HeroSection isLoaded={isLoaded} />
      <MissionSection />
      <FeatureGrid />
      <SponsorCarousel sponsorLogos={sponsorData} />
    </div>
  );
};

export default Index;
