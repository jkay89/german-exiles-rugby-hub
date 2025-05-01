
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getPlayerStats } from "@/utils/playerStats";
import PageHeader from "@/components/fixtures/PageHeader";
import FixturesList from "@/components/fixtures/FixturesList";
import MatchResults from "@/components/fixtures/MatchResults";
import PlayerStatsTable from "@/components/fixtures/PlayerStatsTable";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client-extensions";

// Fixture type
interface Fixture {
  id: string;
  team: string;
  opponent: string;
  date: string;
  time: string;
  location: string;
  competition: string;
  is_home: boolean;
}

// Result type
interface Result {
  id: string;
  fixture_id?: string;
  team: string;
  opponent: string;
  date: string;
  team_score: number;
  opponent_score: number;
  competition: string;
  is_home: boolean;
  motm?: string;
  location?: string;
}

const Fixtures = () => {
  const [activeTab, setActiveTab] = useState<string>("fixtures");
  const { t } = useLanguage();
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  const playerStats = getPlayerStats();
  
  useEffect(() => {
    // Always force fetch both fixtures and results on initial load
    Promise.all([fetchFixtures(), fetchResults()])
      .then(() => setLoading(false))
      .catch((error) => {
        console.error("Error loading fixture/result data:", error);
        setLoading(false);
      });
  }, []); // Run once on mount
  
  // Add separate useEffect to react to tab changes
  useEffect(() => {
    if (activeTab === "fixtures") {
      fetchFixtures();
    } else if (activeTab === "results") {
      fetchResults();
    }
  }, [activeTab]);

  const fetchFixtures = async () => {
    setLoading(true);
    try {
      // Direct database query to ensure fresh data
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase.rest
        .from("fixtures")
        .select('*')
        .gte('date', today)
        .order('date', { ascending: true });
        
      if (error) throw error;
      
      if (data && data.length > 0) {
        console.log("Fixtures data from direct DB query:", data);
        setFixtures(data as Fixture[]);
      } else {
        // If no fixtures in database, create some hardcoded ones
        // This is for initial setup or testing
        const hardcodedFixtures = [
          {
            id: "fixture-1",
            date: "2025-06-06",
            opponent: "Aussie/Kiwi Exiles",
            location: "Wasps FC, Twyford Avenue Sports Ground, Twyford Ave, London W3 9QA",
            time: "TBC",
            team: "Heritage Team",
            competition: "Friendly",
            is_home: true
          },
          {
            id: "fixture-2",
            date: "2025-08-23",
            opponent: "Royal Engineers RL",
            location: "Walton Sports Club, Walton Recreation Ground/Shay La WF2 6LA",
            time: "TBC",
            team: "Heritage Team",
            competition: "Friendly",
            is_home: false
          }
        ];
        
        console.log("Using hardcoded fixtures data:", hardcodedFixtures);
        setFixtures(hardcodedFixtures);
      }
    } catch (error) {
      console.error("Error fetching fixtures:", error);
      toast({
        title: "Error",
        description: "Could not load fixtures. Please try again later.",
        variant: "destructive"
      });
      setFixtures([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchResults = async () => {
    setLoading(true);
    try {
      // Direct database query to ensure fresh data
      const { data, error } = await supabase.rest
        .from("results")
        .select('*')
        .order('date', { ascending: false });
        
      if (error) throw error;
      
      if (data && data.length > 0) {
        console.log("Results data from direct DB query:", data);
        
        // Transform results to include location if not present
        const resultsWithLocation: Result[] = data.map((result: any) => ({
          ...result,
          location: result.location || "Match Venue" // Fallback if location is not stored
        }));
        
        setResults(resultsWithLocation || []);
      } else {
        // If no results in database, create a sample result
        const sampleResult = {
          id: "sample-1",
          team: "Heritage Team",
          opponent: "Rotterdam 9s",
          date: "2024-03-15",
          team_score: 24,
          opponent_score: 12,
          competition: "Friendly",
          is_home: true,
          motm: "Brad Billsborough",
          location: "Rotterdam, Netherlands"
        };
        
        console.log("Using sample result data:", sampleResult);
        setResults([sampleResult]);
      }
    } catch (error) {
      console.error("Error fetching results:", error);
      toast({
        title: "Error",
        description: "Could not load match results. Please try again later.",
        variant: "destructive"
      });
      setResults([]);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="pt-16 min-h-screen bg-black">
      <PageHeader />

      <section className="py-16 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-6">
          <Tabs defaultValue="fixtures" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid w-full md:w-[400px] grid-cols-2 mb-8 bg-gray-800 text-white">
              <TabsTrigger 
                value="fixtures" 
                className="data-[state=active]:bg-german-red data-[state=active]:text-white"
              >
                {t("upcoming_fixtures")}
              </TabsTrigger>
              <TabsTrigger 
                value="results" 
                className="data-[state=active]:bg-german-red data-[state=active]:text-white"
              >
                {t("match_results")}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="fixtures" className="mt-0">
              <FixturesList fixtures={fixtures} loading={loading} />
            </TabsContent>
            
            <TabsContent value="results" className="mt-0">
              <MatchResults results={results} loading={loading} />
            </TabsContent>
          </Tabs>

          <PlayerStatsTable playerStats={playerStats} />
        </div>
      </section>
    </div>
  );
};

export default Fixtures;
