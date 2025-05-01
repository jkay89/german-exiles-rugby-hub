
import { useState, useEffect } from "react";
import { getNextFixture } from "@/utils/fixtureUtils";
import HeroSection from "@/components/home/HeroSection";
import MissionSection from "@/components/home/MissionSection";
import FeatureGrid from "@/components/home/FeatureGrid";
import SponsorCarousel from "@/components/home/SponsorCarousel";
import { sponsorData } from "@/data/sponsorData";
import { importExistingPlayers, syncExistingPlayers } from "@/utils/playerUtils";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsLoaded(true);

    // Check for fixtures and results
    const checkDatabaseData = async () => {
      try {
        const fixture = await getNextFixture();
        console.log("Next fixture on homepage:", fixture);
      } catch (error) {
        console.error("Error checking fixtures:", error);
      }
    };
    
    // First try to import all players
    const syncPlayers = async () => {
      try {
        console.log("Starting player data initialization...");
        // First try to import
        const importResult = await importExistingPlayers();
        if (importResult.success) {
          console.log("Players imported successfully");
          return;
        } else {
          console.log("Players not imported:", importResult.message);
          
          // If players exist but might be incomplete, sync missing ones
          console.log("Syncing any missing players...");
          const syncResult = await syncExistingPlayers();
          
          if (syncResult?.success) {
            console.log("Players synchronized successfully:", syncResult.message);
          } else {
            console.error("Player sync failed:", syncResult?.message);
          }
        }
      } catch (error) {
        console.error("Error in player initialization:", error);
      }
    };
      
    // Run initialization in parallel
    syncPlayers();
    checkDatabaseData();
    
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
