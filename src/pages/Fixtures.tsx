
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import PageHeader from "@/components/fixtures/PageHeader";
import FixtureTabs from "@/components/fixtures/FixtureTabs";
import FixtureGridView from "@/components/fixtures/FixtureGridView";
import PlayerStatsTable from "@/components/fixtures/PlayerStatsTable";
import { useFixtures, FixtureTabType } from "@/hooks/useFixtures";
import { LoadingState, ErrorState, EmptyState } from "@/components/fixtures/FixtureStates";

const Fixtures = () => {
  const [activeTab, setActiveTab] = useState<FixtureTabType>("upcoming");
  const navigate = useNavigate();
  const { fixtures, loading: fixturesLoading, error } = useFixtures(activeTab);

  const renderFixtureContent = () => {
    if (fixturesLoading) {
      return <LoadingState />;
    }
    
    if (error) {
      return <ErrorState message={error} />;
    }
    
    if (fixtures.length === 0) {
      return <EmptyState activeTab={activeTab} />;
    }
    
    return <FixtureGridView fixtures={fixtures} />;
  };

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

        {renderFixtureContent()}
        
        <PlayerStatsTable />
      </motion.div>
    </div>
  );
};

export default Fixtures;
