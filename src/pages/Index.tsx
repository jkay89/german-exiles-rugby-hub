
import { useState, useEffect } from "react";
import { getNextFixture, Fixture } from "@/utils/fixtureUtils";
import HeroSection from "@/components/home/HeroSection";
import MissionSection from "@/components/home/MissionSection";
import FeatureGrid from "@/components/home/FeatureGrid";
import SponsorCarousel from "@/components/home/SponsorCarousel";
import { sponsorData } from "@/data/sponsorData";
import { importExistingPlayers } from "@/utils/playerUtils";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsLoaded(true);
    
    // Import existing players to the database if they don't exist yet
    importExistingPlayers()
      .then((result) => {
        if (result.success) {
          console.log("Players imported successfully");
        } else {
          console.log("Players not imported:", result.message);
        }
      })
      .catch((error) => {
        console.error("Error importing players:", error);
      });
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
