
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import PageHeader from "@/components/fixtures/PageHeader";
import FixtureTabs from "@/components/fixtures/FixtureTabs";
import FixtureGridView from "@/components/fixtures/FixtureGridView";
import ResultsGridView from "@/components/fixtures/ResultsGridView";
import { useFixtures, FixtureTabType } from "@/hooks/useFixtures";
import { LoadingState, ErrorState, EmptyState } from "@/components/fixtures/FixtureStates";

const Fixtures = () => {
  const [activeTab, setActiveTab] = useState<FixtureTabType>("upcoming");
  const navigate = useNavigate();
  const { fixtures, results, loading: dataLoading, error } = useFixtures(activeTab);

  const renderContent = () => {
    if (dataLoading) {
      return <LoadingState />;
    }
    
    if (error) {
      return <ErrorState message={error} />;
    }
    
    if (activeTab === "upcoming" && fixtures.length === 0) {
      return <EmptyState activeTab={activeTab} />;
    }

    if (activeTab === "results" && results.length === 0) {
      return <EmptyState activeTab={activeTab} />;
    }
    
    return activeTab === "upcoming" 
      ? <FixtureGridView fixtures={fixtures} />
      : <ResultsGridView results={results} />;
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
            <h2 className="text-2xl font-bold text-white mb-2">Fixtures & Results</h2>
            <p className="text-gray-400">
              {activeTab === "upcoming" ? "View upcoming matches" : "View match results"}
            </p>
          </div>
          
          <FixtureTabs 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            navigate={navigate}
          />
        </div>

        {renderContent()}
      </motion.div>
    </div>
  );
};

export default Fixtures;
