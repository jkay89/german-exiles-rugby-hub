
import { useState, useEffect } from "react";
import { getNextFixture, Fixture } from "@/utils/fixtureUtils";
import HeroSection from "@/components/home/HeroSection";
import MissionSection from "@/components/home/MissionSection";
import FeatureGrid from "@/components/home/FeatureGrid";
import SponsorCarousel from "@/components/home/SponsorCarousel";
import { SponsorLogo } from "@/components/home/types";

const Index = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [nextFixture, setNextFixture] = useState<Fixture | null>(null);

  useEffect(() => {
    setIsLoaded(true);
    setNextFixture(getNextFixture());
  }, []);

  // Sponsor data sourced from the sponsors page
  const sponsorLogos: SponsorLogo[] = [
    {
      id: "safetech",
      name: "Safetech Innovations",
      logo: "/lovable-uploads/f79f5262-9a43-411e-85bf-4800b6fc4f3e.png",
      website: "https://www.safetechinnovations.com",
      tier: "platinum"
    },
    {
      id: "goldenguard",
      name: "Golden Guard VPN",
      logo: "/lovable-uploads/5dc48408-4d0a-448f-93fe-ee8f8babb02d.png",
      website: "https://goldenguardvpn.com",
      tier: "gold"
    },
    {
      id: "beaubijou",
      name: "Beau Bijou Design",
      logo: "/lovable-uploads/f46f89dd-c0de-4241-8bcb-893623c26c05.png",
      website: "https://beaubijoudesign.com/",
      tier: "silver"
    },
    {
      id: "forjosef",
      name: "ForJosef",
      logo: "/lovable-uploads/86e094ab-21e7-4af4-8964-005499f0b682.png",
      website: null,
      tier: "silver"
    },
    {
      id: "elite",
      name: "Elite Workforce Solutions",
      logo: "/lovable-uploads/3e949f9d-3ac2-457d-aef1-de9e847d7819.png",
      website: "https://eliteworkforcesolutions.com",
      tier: "affiliate"
    },
    {
      id: "wellnesshub",
      name: "Wellness Hub",
      logo: "/lovable-uploads/035a87e1-0bf3-41af-b5da-8f1cb7bb505d.png",
      website: "https://wellnesshub.co",
      tier: "affiliate"
    },
    {
      id: "specialistwind",
      name: "Specialist Wind Services",
      logo: "/lovable-uploads/65a024fb-0b0d-4198-9a6a-2d8c59564522.png",
      website: "https://specialistwindservices.com",
      tier: "affiliate"
    }
  ];

  return (
    <div className="pt-16 min-h-screen bg-black">
      <HeroSection isLoaded={isLoaded} />
      <MissionSection />
      <FeatureGrid nextFixture={nextFixture} />
      <SponsorCarousel sponsorLogos={sponsorLogos} />
    </div>
  );
};

export default Index;
