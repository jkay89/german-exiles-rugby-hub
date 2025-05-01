
import { compareAsc } from "date-fns";
import { supabase } from "@/integrations/supabase/client";

export interface Fixture {
  id?: string;
  team?: string;
  opponent: string;
  date: string;
  time: string;
  location: string;
  competition?: string;
  is_home?: boolean;
}

// Get all fixtures from Supabase, fallback to hardcoded data
export const getFixtures = async (): Promise<Fixture[]> => {
  try {
    // Try to get fixtures from Supabase
    const { data, error } = await supabase
      .from("fixtures")
      .select('*')
      .order('date', { ascending: true });
    
    if (error) throw error;
    
    // If we have data, return it
    if (data && data.length > 0) {
      console.log("Fixtures found in database:", data);
      return data as Fixture[];
    }
    
    console.log("No fixtures found in database, using hardcoded fixtures");
    // Fallback to hardcoded fixtures
    return [
      {
        date: "2025-04-19",
        opponent: "Rotterdam 9s",
        location: "Rotterdam Pitbulls RLFC, Rotterdam, Netherlands",
        time: "TBC",
      },
      {
        date: "2025-06-06",
        opponent: "Aussie/Kiwi Exiles",
        location: "Wasps FC, Twyford Avenue Sports Ground, Twyford Ave, London W3 9QA",
        time: "TBC",
      },
      {
        date: "2025-08-23",
        opponent: "Royal Engineers RL",
        location: "Walton Sports Club, Walton Recreation Ground/Shay La WF2 6LA",
        time: "TBC",
      },
      {
        date: "2025-09-06",
        opponent: "Presidents XIII",
        location: "Würzburg, Bayern, Deutschland",
        time: "TBC",
      },
    ];
  } catch (error) {
    console.error("Error fetching fixtures:", error);
    // Fallback to hardcoded fixtures on error
    return [
      {
        date: "2025-04-19",
        opponent: "Rotterdam 9s",
        location: "Rotterdam Pitbulls RLFC, Rotterdam, Netherlands",
        time: "TBC",
      },
      {
        date: "2025-06-06",
        opponent: "Aussie/Kiwi Exiles",
        location: "Wasps FC, Twyford Avenue Sports Ground, Twyford Ave, London W3 9QA",
        time: "TBC",
      },
      {
        date: "2025-08-23",
        opponent: "Royal Engineers RL",
        location: "Walton Sports Club, Walton Recreation Ground/Shay La WF2 6LA",
        time: "TBC",
      },
      {
        date: "2025-09-06",
        opponent: "Presidents XIII",
        location: "Würzburg, Bayern, Deutschland",
        time: "TBC",
      },
    ];
  }
};

// Get the next upcoming fixture based on the current date
export const getNextFixture = async (): Promise<Fixture | null> => {
  try {
    const now = new Date();
    const today = now.toISOString().split('T')[0]; // Format as YYYY-MM-DD
    
    // Try to get from Supabase first
    const { data, error } = await supabase
      .from("fixtures")
      .select('*')
      .gte('date', today)
      .order('date', { ascending: true })
      .limit(1);
    
    if (error) throw error;
    
    if (data && data.length > 0) {
      console.log("Next fixture found in database:", data[0]);
      return data[0] as Fixture;
    }
    
    console.log("No fixtures found in database, using hardcoded fixtures for next fixture");
    // If nothing from DB, get from hardcoded data
    const fixtures = await getFixtures();
    
    // Filter fixtures that haven't happened yet
    const upcomingFixtures = fixtures.filter(
      fixture => compareAsc(new Date(fixture.date), now) > 0
    );
    
    // Sort by date (ascending)
    upcomingFixtures.sort((a, b) => 
      compareAsc(new Date(a.date), new Date(b.date))
    );
    
    // Return the next fixture or null if none found
    return upcomingFixtures.length > 0 ? upcomingFixtures[0] : null;
  } catch (error) {
    console.error("Error fetching next fixture:", error);
    return null;
  }
};

// Get all match results
export const getResults = async (): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from("results")
      .select('*')
      .order('date', { ascending: false });
    
    if (error) throw error;
    
    // If we have data from the database, return it
    if (data && data.length > 0) {
      console.log("Results found in database:", data);
      return data;
    }
    
    console.log("No results found, returning sample result");
    // Create a sample result if none are available
    return [{
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
    }];
  } catch (error) {
    console.error("Error fetching results:", error);
    // Return sample result on error
    return [{
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
    }];
  }
};

// Get latest result
export const getLatestResult = async (): Promise<any | null> => {
  try {
    const { data, error } = await supabase
      .from("results")
      .select('*')
      .order('date', { ascending: false })
      .limit(1);
    
    if (error) throw error;
    
    if (data && data.length > 0) {
      console.log("Latest result found in database:", data[0]);
      return data[0];
    }
    
    console.log("No results found in database, returning sample result");
    // Provide a sample result if no results are found
    return {
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
  } catch (error) {
    console.error("Error fetching latest result:", error);
    // Return sample result on error
    return {
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
  }
};
