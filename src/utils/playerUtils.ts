import { supabase } from "@/integrations/supabase/client";

export interface Player {
  id: string;
  name: string;
  number?: number | null;
  position?: string | null;
  team: string;
  heritage?: string | null;
  club?: string | null;
  bio?: string | null;
  photo_url?: string | null;
  national_number?: string | null;
}

// Fetch all players
export const fetchAllPlayers = async (): Promise<Player[]> => {
  try {
    // Force fetch with cache control to get fresh data
    const { data, error } = await supabase
      .from('players')
      .select('*')
      .order('name');
      
    if (error) throw error;
    
    console.log(`Fetched ${data?.length || 0} players:`, data);
    return data || [];
  } catch (error: any) {
    console.error('Error fetching players:', error.message);
    return [];
  }
};

// Fetch players by team
export const fetchPlayersByTeam = async (team: string): Promise<Player[]> => {
  try {
    console.log(`Fetching players for team: ${team}`);
    
    // Force fetch with cache control to get fresh data
    const { data, error } = await supabase
      .from('players')
      .select('*')
      .eq('team', team)
      .order('number', { ascending: true })
      .order('name');
      
    if (error) {
      console.error(`Error in Supabase query for ${team} players:`, error);
      throw error;
    }
    
    console.log(`Found ${data?.length || 0} players for team ${team}:`, data);
    return data || [];
  } catch (error: any) {
    console.error(`Error fetching ${team} players:`, error.message);
    throw new Error(`Failed to fetch players: ${error.message}`);
  }
};

// Create a new player
export const createPlayer = async (player: Omit<Player, 'id'>): Promise<Player> => {
  try {
    const { data, error } = await supabase
      .from('players')
      .insert(player)
      .select()
      .single();
      
    if (error) throw error;
    
    console.log("Created new player:", data);
    return data;
  } catch (error: any) {
    console.error('Error creating player:', error.message);
    throw new Error(`Failed to create player: ${error.message}`);
  }
};

// Update an existing player
export const updatePlayer = async (id: string, player: Partial<Player>): Promise<Player> => {
  try {
    const { data, error } = await supabase
      .from('players')
      .update(player)
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    
    console.log("Updated player:", data);
    return data;
  } catch (error: any) {
    console.error('Error updating player:', error.message);
    throw new Error(`Failed to update player: ${error.message}`);
  }
};

// Delete a player
export const deletePlayer = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('players')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    
    console.log(`Deleted player with id: ${id}`);
  } catch (error: any) {
    console.error('Error deleting player:', error.message);
    throw new Error(`Failed to delete player: ${error.message}`);
  }
};

// Sample data for initial players - we'll keep this for compatibility but it's no longer used
const samplePlayers = [
  // Heritage team
  {
    name: "Brad Billsborough",
    number: 7,
    position: "Halfback",
    team: "heritage",
    heritage: "German",
    club: "Rochdale Hornets",
  },
  {
    name: "Noah Katterbach",
    number: 9,
    position: "Hooker",
    team: "heritage",
    heritage: "German",
    club: "FC Köln",
  },
  {
    name: "Max Keitel",
    number: 3,
    position: "Centre",
    team: "heritage",
    heritage: "German",
    club: "Hannover Rugby FC",
  },
  // Exiles 9s
  {
    name: "Adam Vario",
    position: "Forward",
    team: "exiles9s",
    heritage: "British",
    bio: "Role: Forward",
  },
  {
    name: "Chris Meyer",
    position: "Halfback",
    team: "exiles9s",
    heritage: "German",
    bio: "Role: Team Manager",
  },
  {
    name: "Kai Murphy",
    position: "Utility",
    team: "exiles9s",
    heritage: "German",
    bio: "Role: Utility Player",
  }
];

// Import existing players to the database if they don't exist yet
export const importExistingPlayers = async (): Promise<{ success: boolean, message: string }> => {
  try {
    console.log("Checking for existing players in the database...");
    
    // First check if we already have players in the database
    const { count, error } = await supabase
      .from('players')
      .select('*', { count: 'exact', head: true });
      
    if (error) throw error;
    
    // If we already have players, don't import
    if (count && count > 0) {
      console.log(`Found ${count} players already in database, skipping import`);
      return { success: false, message: "Players already exist in the database" };
    }
    
    // Fetch players from each team page that should be added to the database
    console.log("No players found in database, importing sample players");
    
    // Insert the sample players
    const { error: insertError } = await supabase
      .from('players')
      .insert(samplePlayers);
      
    if (insertError) throw insertError;
    
    console.log("Successfully imported sample players into database");
    return { success: true, message: "Players imported successfully" };
  } catch (error: any) {
    console.error('Error importing players:', error.message);
    return { success: false, message: error.message };
  }
};

// Sync existing players from sample data to database
export const syncExistingPlayers = async (): Promise<{success: boolean, message: string}> => {
  try {
    console.log("Synchronizing players in database with sample data...");
    
    // Force re-fetch existing players with cache control
    const { data: existingPlayers, error } = await supabase
      .from('players')
      .select('*');
      
    if (error) throw error;
    
    const count = existingPlayers?.length || 0;
    console.log(`Found ${count} players in database before sync`);
    
    // If we already have players but they might be missing some from sample data
    // Check if each sample player exists, and add if missing
    let added = 0;
    for (const samplePlayer of samplePlayers) {
      const exists = existingPlayers?.some(
        p => p.name === samplePlayer.name && p.team === samplePlayer.team
      );
      
      if (!exists) {
        console.log(`Adding missing player: ${samplePlayer.name} to ${samplePlayer.team}`);
        
        const { error: insertError } = await supabase
          .from('players')
          .insert([samplePlayer]);
          
        if (insertError) {
          console.error(`Error adding player ${samplePlayer.name}:`, insertError);
          throw insertError;
        }
        
        added++;
        console.log(`Added missing player: ${samplePlayer.name} to ${samplePlayer.team}`);
      } else {
        console.log(`Player ${samplePlayer.name} already exists for team ${samplePlayer.team}`);
      }
    }
    
    // Re-fetch the count after sync
    const { data: updatedPlayers, error: countError } = await supabase
      .from('players')
      .select('*');
      
    if (countError) throw countError;
    
    const newCount = updatedPlayers?.length || 0;
    
    return { 
      success: true, 
      message: `Players synchronized. Added ${added} missing players. Database now has ${newCount} players.` 
    };
  } catch (error: any) {
    console.error('Error synchronizing players:', error.message);
    return { success: false, message: error.message };
  }
};
