
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client-extensions";

export interface Fixture {
  id: string;
  date: string;
  time: string;
  opponent: string;
  location: string;
  is_home: boolean;
  competition: string;
  team?: string;
}

export type FixtureTabType = "upcoming" | "past";

export const useFixtures = (activeTab: FixtureTabType) => {
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFixtures = async () => {
      setLoading(true);
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
          setLoading(false);
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
        setLoading(false);
      }
    };
    
    fetchFixtures();
  }, [activeTab]);

  return { fixtures, loading, error };
};

export default useFixtures;
