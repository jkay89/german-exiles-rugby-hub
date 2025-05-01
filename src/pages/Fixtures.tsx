
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getPlayerStats } from "@/utils/playerStats";
import PageHeader from "@/components/fixtures/PageHeader";
import FixturesList from "@/components/fixtures/FixturesList";
import MatchResults from "@/components/fixtures/MatchResults";
import PlayerStatsTable from "@/components/fixtures/PlayerStatsTable";
import { useLanguage } from "@/contexts/LanguageContext";
import { getFixtures, getResults } from "@/utils/fixtureUtils";
import { useToast } from "@/components/ui/use-toast";

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
    if (activeTab === "fixtures") {
      fetchFixtures();
    } else {
      fetchResults();
    }
  }, [activeTab]);

  const fetchFixtures = async () => {
    setLoading(true);
    try {
      const fixturesData = await getFixtures();
      console.log("Fixtures data in page:", fixturesData);
      setFixtures(fixturesData as Fixture[]);
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
      const resultsData = await getResults();
      console.log("Results data in page:", resultsData);
      
      // Transform results to include location if not present
      const resultsWithLocation: Result[] = resultsData.map((result: any) => ({
        ...result,
        location: result.location || "Match Venue" // Fallback if location is not stored
      }));
      
      setResults(resultsWithLocation || []);
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
