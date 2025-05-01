
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Loader2, Calendar, Trophy } from "lucide-react";
import { supabase } from "@/integrations/supabase/client-extensions";
import { getPlayerStats } from "@/utils/playerStats";
import FixtureCard from "@/components/fixtures/FixtureCard";
import PageHeader from "@/components/fixtures/PageHeader";
import FixtureTabs from "@/components/fixtures/FixtureTabs";
import FixturesList from "@/components/fixtures/FixturesList";
import PlayerStatsTable from "@/components/fixtures/PlayerStatsTable";

interface Fixture {
  id: string;
  date: string;
  time: string;
  opponent: string;
  location: string;
  is_home: boolean;
  competition: string;
  team?: string;
}

const Fixtures = () => {
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [fixturesLoading, setFixturesLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch fixtures with separate useEffect to avoid UI flickering
  useEffect(() => {
    const fetchFixtures = async () => {
      setFixturesLoading(true);
      setError(null);
      console.log("Fetching fixtures data, activeTab:", activeTab);

      try {
        const { data: fixtureData, error: fixtureError } = await supabase.rest
          .from('fixtures')
          .select('*');

        if (fixtureError) {
          console.error("Fixtures error:", fixtureError);
          throw new Error(`Error fetching fixtures: ${fixtureError.message}`);
        }

        console.log("Fixture data received:", fixtureData);

        if (!fixtureData || fixtureData.length === 0) {
          console.log("No fixtures data found");
          setFixtures([]);
          setFixturesLoading(false);
          return;
        }

        // Filter fixtures based on date
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set to start of day for accurate comparison
        
        const upcoming = fixtureData.filter(fixture => {
          try {
            const fixtureDate = new Date(fixture.date);
            fixtureDate.setHours(0, 0, 0, 0); // Set to start of day
            return fixtureDate >= today;
          } catch (error) {
            console.error("Error parsing fixture date:", fixture.date, error);
            return false; // Skip fixtures with invalid dates
          }
        });
        
        const past = fixtureData.filter(fixture => {
          try {
            const fixtureDate = new Date(fixture.date);
            fixtureDate.setHours(0, 0, 0, 0); // Set to start of day
            return fixtureDate < today;
          } catch (error) {
            console.error("Error parsing fixture date:", fixture.date, error);
            return false; // Skip fixtures with invalid dates
          }
        });
        
        console.log("Upcoming fixtures:", upcoming.length);
        console.log("Past fixtures:", past.length);

        // Sort upcoming fixtures by date and time
        upcoming.sort((a, b) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          if (dateA.getTime() !== dateB.getTime()) {
            return dateA.getTime() - dateB.getTime();
          }
          return a.time?.localeCompare(b.time || ""); // Sort by time if dates are equal
        });

        // Sort past fixtures by date in descending order
        past.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        // Set fixtures based on the active tab
        const fixturesList = activeTab === "upcoming" ? upcoming : past;
        console.log(`Setting ${fixturesList.length} ${activeTab} fixtures`);
        setFixtures(fixturesList);
      } catch (err: any) {
        console.error("Error loading fixtures:", err);
        setError(err.message || "Failed to load fixtures");
      } finally {
        setFixturesLoading(false);
      }
    };
    
    fetchFixtures();
  }, [activeTab, i18n.language]);

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
        
        {/* Player Statistics section moved to a separate component */}
        <PlayerStatsTable />
      </motion.div>
    </div>
  );
};

export default Fixtures;
