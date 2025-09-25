
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

export interface Result {
  id: string;
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

export type FixtureTabType = "upcoming" | "results";

export const useFixtures = (activeTab: FixtureTabType) => {
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      console.log("Fetching data, activeTab:", activeTab);

      try {
        if (activeTab === "upcoming") {
          // Fetch upcoming fixtures
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

          // Filter and sort upcoming fixtures
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
          
          console.log("Upcoming fixtures:", upcoming.length);
          
          // Sort upcoming fixtures by date and time
          upcoming.sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            if (dateA.getTime() !== dateB.getTime()) {
              return dateA.getTime() - dateB.getTime();
            }
            return a.time?.localeCompare(b.time || ""); // Sort by time if dates are equal
          });
          
          setFixtures(upcoming);
        } else {
          // Fetch results
          const { data: resultsData, error: resultsError } = await supabase.rest
            .from('results')
            .select('*')
            .order('date', { ascending: false });

          if (resultsError) {
            console.error("Results error:", resultsError);
            throw new Error(`Error fetching results: ${resultsError.message}`);
          }

          console.log("Results data received:", resultsData);
          setResults(resultsData || []);
        }
      } catch (err: any) {
        console.error("Error loading data:", err);
        setError(err.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [activeTab]);

  const refetch = () => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      console.log("Refetching data, activeTab:", activeTab);

      try {
        if (activeTab === "upcoming") {
          // Fetch upcoming fixtures
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

          // Filter and sort upcoming fixtures
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
          
          console.log("Upcoming fixtures:", upcoming.length);
          
          // Sort upcoming fixtures by date and time
          upcoming.sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            if (dateA.getTime() !== dateB.getTime()) {
              return dateA.getTime() - dateB.getTime();
            }
            return a.time?.localeCompare(b.time || ""); // Sort by time if dates are equal
          });
          
          setFixtures(upcoming);
        } else {
          // Fetch results
          const { data: resultsData, error: resultsError } = await supabase.rest
            .from('results')
            .select('*')
            .order('date', { ascending: false });

          if (resultsError) {
            console.error("Results error:", resultsError);
            throw new Error(`Error fetching results: ${resultsError.message}`);
          }

          console.log("Results data received:", resultsData);
          setResults(resultsData || []);
        }
      } catch (err: any) {
        console.error("Error loading data:", err);
        setError(err.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  };

  return { fixtures, results, loading, error, refetch };
};

export default useFixtures;
