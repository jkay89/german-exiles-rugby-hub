
import { supabase } from "@/integrations/supabase/client-extensions";

// Define interfaces for player data
export interface Player {
  id: string;
  name: string;
  number?: number;
  position?: string;
  team: string;
  heritage?: string;
  club?: string;
  bio?: string;
  photo_url?: string;
  created_at?: string;
}

// Function to fetch players by team
export async function fetchPlayersByTeam(team: string) {
  try {
    const { data, error } = await supabase.rest
      .from('players')
      .select('*')
      .eq('team', team)
      .order('number', { ascending: true });
    
    if (error) throw error;
    return data as Player[];
  } catch (error) {
    console.error("Error fetching players:", error);
    return [];
  }
}

// Function to create a player
export async function createPlayer(playerData: {
  name: string;
  number?: number | null;
  position?: string | null;
  team: string;
  heritage?: string | null;
  club?: string | null;
  bio?: string | null;
  photo_url?: string | null;
}) {
  try {
    const { data, error } = await supabase.rest
      .from('players')
      .insert([playerData])
      .select();
    
    if (error) throw error;
    return data[0] as Player;
  } catch (error) {
    console.error("Error creating player:", error);
    throw error;
  }
}

// Function to update a player
export async function updatePlayer(id: string, playerData: {
  name: string;
  number?: number | null;
  position?: string | null;
  team: string;
  heritage?: string | null;
  club?: string | null;
  bio?: string | null;
  photo_url?: string | null;
}) {
  try {
    const { error } = await supabase.rest
      .from('players')
      .update(playerData)
      .eq('id', id);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error updating player:", error);
    throw error;
  }
}

// Function to delete a player
export async function deletePlayer(id: string) {
  try {
    const { error } = await supabase.rest
      .from('players')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error deleting player:", error);
    throw error;
  }
}
