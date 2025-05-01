
import { compareAsc } from "date-fns";
import { supabase } from "@/integrations/supabase/client";

export interface PlayerStats {
  id: string;
  name: string;
  position: string;
  gamesPlayed: number;
  trysScored: number;
  pointsScored: number;
  yellowCards: number;
  redCards: number;
  manOfTheMatch: number;
  image?: string;
  playerId?: string;
}

export interface MatchResult {
  date: string;
  opponent: string;
  location: string;
  homeScore?: number;
  awayScore?: number;
  isHome: boolean;
}

// Get player stats from database
export const getPlayerStats = async (): Promise<PlayerStats[]> => {
  try {
    const { data, error } = await supabase
      .from('player_stats')
      .select('*');
      
    if (error) throw error;
    
    if (data && data.length > 0) {
      return data.map(item => ({
        id: item.id,
        name: item.name,
        position: item.position || "",
        gamesPlayed: item.games_played || 0,
        trysScored: item.trys_scored || 0,
        pointsScored: item.points_scored || 0,
        yellowCards: item.yellow_cards || 0,
        redCards: item.red_cards || 0,
        manOfTheMatch: item.man_of_the_match || 0,
        image: item.photo_url,
        playerId: item.player_id
      }));
    }
    
    // Return empty array if no data
    return [];
  } catch (error) {
    console.error("Error fetching player stats:", error);
    return [];
  }
};

// Get player stats by ID
export const getPlayerStatsById = async (id: string): Promise<PlayerStats | null> => {
  try {
    const { data, error } = await supabase
      .from('player_stats')
      .select('*')
      .eq('player_id', id)
      .single();
      
    if (error) {
      // If no data found, return null
      if (error.code === 'PGRST116') {
        return null;
      }
      throw error;
    }
    
    if (data) {
      return {
        id: data.id,
        name: data.name,
        position: data.position || "",
        gamesPlayed: data.games_played || 0,
        trysScored: data.trys_scored || 0,
        pointsScored: data.points_scored || 0,
        yellowCards: data.yellow_cards || 0,
        redCards: data.red_cards || 0,
        manOfTheMatch: data.man_of_the_match || 0,
        image: data.photo_url,
        playerId: data.player_id
      };
    }
    
    return null;
  } catch (error) {
    console.error("Error fetching player stats by ID:", error);
    return null;
  }
};

// Create or update player stats
export const savePlayerStats = async (stats: Partial<PlayerStats>): Promise<PlayerStats> => {
  // Format the data for the database
  const dbStats = {
    player_id: stats.id,
    name: stats.name,
    position: stats.position,
    games_played: stats.gamesPlayed || 0,
    trys_scored: stats.trysScored || 0,
    points_scored: stats.pointsScored || 0,
    yellow_cards: stats.yellowCards || 0,
    red_cards: stats.redCards || 0,
    man_of_the_match: stats.manOfTheMatch || 0,
    photo_url: stats.image
  };

  try {
    // Check if stats already exist for this player
    const { data: existingStats, error: fetchError } = await supabase
      .from('player_stats')
      .select('id')
      .eq('player_id', stats.id)
      .maybeSingle();
    
    if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;
    
    let result;
    
    if (existingStats) {
      // Update existing stats
      const { data, error } = await supabase
        .from('player_stats')
        .update(dbStats)
        .eq('id', existingStats.id)
        .select()
        .single();
      
      if (error) throw error;
      result = data;
    } else {
      // Insert new stats
      const { data, error } = await supabase
        .from('player_stats')
        .insert(dbStats)
        .select()
        .single();
      
      if (error) throw error;
      result = data;
    }
    
    // Convert back to PlayerStats interface
    return {
      id: result.id,
      name: result.name,
      position: result.position || "",
      gamesPlayed: result.games_played || 0,
      trysScored: result.trys_scored || 0,
      pointsScored: result.points_scored || 0,
      yellowCards: result.yellow_cards || 0,
      redCards: result.red_cards || 0,
      manOfTheMatch: result.man_of_the_match || 0,
      image: result.photo_url,
      playerId: result.player_id
    };
  } catch (error) {
    console.error("Error saving player stats:", error);
    throw error;
  }
};

// Empty match results data since the German Exiles don't have any results yet
export const getMatchResults = (): MatchResult[] => {
  return [];
};
