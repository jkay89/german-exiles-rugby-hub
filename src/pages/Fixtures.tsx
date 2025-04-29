
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getPlayerStats } from "@/utils/playerStats";
import PageHeader from "@/components/fixtures/PageHeader";
import FixturesList from "@/components/fixtures/FixturesList";
import MatchResults from "@/components/fixtures/MatchResults";
import PlayerStatsTable from "@/components/fixtures/PlayerStatsTable";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";

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
  
  const playerStats = getPlayerStats();
  
  useEffect(() => {
    if (activeTab === "fixtures") {
      fetchFixtures();
    } else {
      fetchResults();
    }
  }, [activeTab]);

  const fetchFixtures = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("fixtures")
        .select('*')
        .order('date', { ascending: true });

      if (error) throw error;
      setFixtures(data as Fixture[] || []);
    } catch (error) {
      console.error("Error fetching fixtures:", error);
      // Fallback to hardcoded fixtures
      setFixtures([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchResults = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("results")
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      
      // Transform results to include location
      const resultsWithLocation: Result[] = data.map((result: any) => ({
        ...result,
        location: result.location || "Match Venue" // Fallback if location is not stored
      }));
      
      setResults(resultsWithLocation || []);
    } catch (error) {
      console.error("Error fetching results:", error);
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
