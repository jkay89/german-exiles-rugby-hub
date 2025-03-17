
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getPlayerStats, getMatchResults } from "@/utils/playerStats";
import { getFixtures } from "@/utils/fixtureUtils";
import PageHeader from "@/components/fixtures/PageHeader";
import FixturesList from "@/components/fixtures/FixturesList";
import MatchResults from "@/components/fixtures/MatchResults";
import PlayerStatsTable from "@/components/fixtures/PlayerStatsTable";
import { useLanguage } from "@/contexts/LanguageContext";

const Fixtures = () => {
  const [activeTab, setActiveTab] = useState<string>("fixtures");
  const { t } = useLanguage();
  
  const fixtures = getFixtures();
  const results = getMatchResults();
  const playerStats = getPlayerStats();
  
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
              <FixturesList fixtures={fixtures} />
            </TabsContent>
            
            <TabsContent value="results" className="mt-0">
              <MatchResults results={results} />
            </TabsContent>
          </Tabs>

          <PlayerStatsTable playerStats={playerStats} />
        </div>
      </section>
    </div>
  );
};

export default Fixtures;
