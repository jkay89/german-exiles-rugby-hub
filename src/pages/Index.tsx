
import { useState, useEffect } from "react";
import HeroSection from "@/components/home/HeroSection";
import MissionSection from "@/components/home/MissionSection";
import FeatureGrid from "@/components/home/FeatureGrid";
import SponsorCarousel from "@/components/home/SponsorCarousel";
import { sponsorData } from "@/data/sponsorData";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsLoaded(true);

    // Check for database setup and integrity
    const checkDatabaseData = async () => {
      try {
        // Check if we have fixtures
        const { data: fixturesData, error: fixturesError } = await supabase
          .from("fixtures")
          .select('count')
          .single();
          
        if (fixturesError) throw fixturesError;
        
        // Check if we have results
        const { data: resultsData, error: resultsError } = await supabase
          .from("results")
          .select('count')
          .single();
          
        if (resultsError) throw resultsError;
        
        console.log("Database status check - Fixtures:", fixturesData, "Results:", resultsData);
      } catch (error) {
        console.error("Error checking database data:", error);
      }
    };
    
    // Check for player data
    const checkPlayerData = async () => {
      try {
        // Get player counts by team
        const { data: heritagePlayers, error: heritageError } = await supabase
          .from('players')
          .select('count')
          .eq('team', 'heritage')
          .single();
          
        if (heritageError) throw heritageError;
        
        const { data: communityPlayers, error: communityError } = await supabase
          .from('players')
          .select('count')
          .eq('team', 'community')
          .single();
          
        if (communityError) throw communityError;
        
        const { data: exiles9sPlayers, error: exiles9sError } = await supabase
          .from('players')
          .select('count')
          .eq('team', 'exiles9s')
          .single();
          
        if (exiles9sError) throw exiles9sError;
        
        console.log("Player data check - Heritage:", heritagePlayers, "Community:", communityPlayers, "Exiles 9s:", exiles9sPlayers);
      } catch (error) {
        console.error("Error checking player data:", error);
        toast({
          title: "Player Data Warning",
          description: "Could not verify player data. Some information might be missing.",
          variant: "destructive",
        });
      }
    };
      
    // Run checks in parallel
    checkDatabaseData();
    checkPlayerData();
    
  }, [toast]);

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
