
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

import { Loader2 } from "lucide-react";
import FixtureCard from "@/components/fixtures/FixtureCard";
import PageHeader from "@/components/fixtures/PageHeader";
import FixtureTabs from "@/components/fixtures/FixtureTabs";
import FixturesList from "@/components/fixtures/FixturesList";
import PlayerStatsTable from "@/components/fixtures/PlayerStatsTable";
import { useFixtures, FixtureTabType } from "@/hooks/useFixtures";

const Fixtures = () => {
  const [activeTab, setActiveTab] = useState<FixtureTabType>("upcoming");
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const { fixtures, loading: fixturesLoading, error } = useFixtures(activeTab);

  return (
    <div className="min-h-screen bg-black">
      <PageHeader />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto py-12 px-4"
      >
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Fixtures</h2>
            <p className="text-gray-400">{activeTab === "upcoming" ? "View upcoming matches" : "View past matches"}</p>
          </div>
          
          <FixtureTabs 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            navigate={navigate}
          />
        </div>

        {fixturesLoading && 
          <div className="flex justify-center items-center py-12 bg-gray-900 rounded-lg border border-gray-800">
            <Loader2 className="w-8 h-8 text-german-gold animate-spin mr-2" />
            <p className="text-center text-gray-400">Loading...</p>
          </div>
        }
        
        {error && !fixturesLoading && 
          <div className="bg-red-900/20 border border-red-500 rounded-lg p-4 mb-6">
            <p className="text-center text-red-500">Error: {error}</p>
          </div>
        }

        {!fixturesLoading && !error && fixtures.length === 0 && (
          <div className="bg-gray-900 rounded-lg p-8 text-center border border-gray-800">
            <p className="text-gray-400">
              {activeTab === "upcoming" 
                ? "No upcoming fixtures available." 
                : "No past fixtures available."}
            </p>
          </div>
        )}

        {!fixturesLoading && !error && fixtures.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {fixtures.map((fixture) => (
              <FixtureCard 
                key={fixture.id}
                id={fixture.id}
                date={fixture.date} 
                time={fixture.time || "TBC"}
                opponent={fixture.opponent} 
                location={fixture.location}
                is_home={fixture.is_home}
                competition={fixture.competition}
                locale={i18n.language}
                team={fixture.team}
              />
            ))}
          </div>
        )}
        
        {/* Player Statistics section */}
        <PlayerStatsTable />
      </motion.div>
    </div>
  );
};

export default Fixtures;
