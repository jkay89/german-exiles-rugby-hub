
import { supabase } from "@/integrations/supabase/client-extensions";

// Define interfaces for our player types
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
  created_at?: string;
  updated_at?: string;
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
    console.error(`Error fetching ${team} players:`, error);
    return [];
  }
}

// Function to fetch a single player
export async function fetchPlayer(id: string) {
  try {
    const { data, error } = await supabase.rest
      .from('players')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data as Player;
  } catch (error) {
    console.error("Error fetching player:", error);
    return null;
  }
}

// Function to create a player
export async function createPlayer(playerData: Omit<Player, 'id' | 'created_at' | 'updated_at'>) {
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
export async function updatePlayer(id: string, playerData: Omit<Player, 'id' | 'created_at' | 'updated_at'>) {
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

// Import existing players from the frontend data to the database
export async function importExistingPlayers() {
  try {
    // Check if we already have players in the database
    const { count, error: countError } = await supabase.rest
      .from('players')
      .select('*', { count: 'exact', head: true });
    
    if (countError) throw countError;
    
    // Only import if we don't have players yet
    if (count === 0) {
      // Heritage Team Players
      const heritagePlayers = [
        { teamNumber: "#001", name: "Jay Kay", position: "Outside Backs", countryHeritage: "DE", nationalTeamNumber: "#204", image: "/lovable-uploads/7cdbd50d-8320-4db0-9303-53445bf0e348.png" },
        { teamNumber: "#002", name: "Zak Bredin", position: "Centre", countryHeritage: "DE", image: "/lovable-uploads/2c677fd8-f43a-45a8-b0a1-491ba2d9eae4.png" },
        { teamNumber: "#003", name: "Oliver Bowie", position: "Second Row", countryHeritage: "DE", nationalTeamNumber: "#205" },
        { teamNumber: "#004", name: "Charlie Tetley", position: "Prop", countryHeritage: "DE" },
        { teamNumber: "#005", name: "George Wood", position: "Centre", countryHeritage: "DE" },
        { teamNumber: "#006", name: "Will Waring", position: "Second Row", countryHeritage: "DE" },
        { teamNumber: "#007", name: "Anthony Hackman", position: "Prop", countryHeritage: "DE" },
        { teamNumber: "#008", name: "Connor Hampson", position: "Prop", countryHeritage: "DE" },
        { teamNumber: "#009", name: "Alex Land", position: "Prop", countryHeritage: "GB" },
        { teamNumber: "#010", name: "Andy Hoggins", position: "Loose Forward", countryHeritage: "DE" },
        { teamNumber: "#011", name: "Joe Wood", position: "Dummy Half", countryHeritage: "GB" },
        { teamNumber: "#012", name: "Jamie Billsborough", position: "Hooker", countryHeritage: "GB" },
        { teamNumber: "#013", name: "Brad Billsborough", position: "Half Back", countryHeritage: "DE" },
        { teamNumber: "#014", name: "Ryan Hudson", position: "Prop", countryHeritage: "GB" },
        { teamNumber: "#015", name: "Zach Burke", position: "Centre", countryHeritage: "GB" },
        { teamNumber: "#016", name: "Eddie Briggs", position: "Second Row", countryHeritage: "DE" },
        { teamNumber: "#017", name: "Eoin Bowie", position: "Second Row", countryHeritage: "DE" },
        { teamNumber: "#018", name: "Joshua McConnell", position: "Loose Forward", countryHeritage: "DE" },
        { teamNumber: "#019", name: "Ad Morley", position: "Centre", countryHeritage: "DE" },
        { teamNumber: "#022", name: "Callum Corey", position: "Second Row", countryHeritage: "DE" },
        { teamNumber: "#023", name: "Shaun Smith", position: "Centre", countryHeritage: "DE" },
        { teamNumber: "#024", name: "Lewis Wilson", position: "Centre", countryHeritage: "GB" },
        { teamNumber: "#025", name: "Michael MacDonald", position: "Half Back", countryHeritage: "DE" },
        { teamNumber: "#026", name: "Arron Williams", position: "Second Row", countryHeritage: "DE" },
        { teamNumber: "#027", name: "Jordan Williams", position: "Prop", countryHeritage: "DE" },
        { teamNumber: "#028", name: "Louis Beattie", position: "Loose Forward", countryHeritage: "DE" },
        { teamNumber: "#029", name: "Michael Knight", position: "Prop", countryHeritage: "GB" },
        { teamNumber: "#030", name: "James Adams", position: "Second Row", countryHeritage: "DE" },
      ];

      for (const player of heritagePlayers) {
        const number = player.teamNumber ? parseInt(player.teamNumber.replace('#', '')) : null;
        await createPlayer({
          name: player.name,
          number: number,
          position: player.position,
          team: 'heritage',
          heritage: player.countryHeritage === "DE" ? "German" : "British",
          photo_url: player.image || null,
        });
      }

      // Exiles9s Players
      const exilesPlayers = [
        { number: "15", name: "Jay Kay", position: "Outside Backs", countryHeritage: "DE", currentClub: "Thornhill Trojans", role: "Captain", image: "/lovable-uploads/dc8c46be-81e9-4ddf-9b23-adc3f72d2989.png" },
        { number: "5", name: "Zak Bredin", position: "Half Back", countryHeritage: "DE", currentClub: "Eastern Rhinos", role: "Vice Captain", image: "/lovable-uploads/2c677fd8-f43a-45a8-b0a1-491ba2d9eae4.png" },
        { number: "44", name: "Henning Brockmann", position: "2nd Row", countryHeritage: "DE", currentClub: "Unaffiliated", role: "Vice Captain", image: "/lovable-uploads/9c438e26-41cf-42af-90d6-4797bbc5f8b0.png" },
        { number: "23", name: "Malte Rohrmoser", position: "2nd Row", countryHeritage: "DE", currentClub: "Ruhrpott Ritter", image: "/lovable-uploads/dd1e1552-347d-4fc8-a19f-4f4e00b56168.png" },
        { number: "17", name: "Fabian Wendt", countryHeritage: "DE" },
        { number: "1", name: "Benedikt Esser", countryHeritage: "DE" },
        { number: "3", name: "Aaron Willmott", position: "Outside Backs", countryHeritage: "DE", currentClub: "Munich/Unterföhring", image: "/lovable-uploads/5bf2f50a-6738-4cc5-804e-fb82f4d1634b.png" },
        { number: "10", name: "Joshua McConnell", position: "Loose Forward", countryHeritage: "DE", currentClub: "Wath Brow Hornets" },
        { number: "8", name: "Korbi Mayer", countryHeritage: "DE" },
        { number: "19", name: "Harry Cartwright", countryHeritage: "DE" },
        { number: "12", name: "Zach Burke", position: "Centre", countryHeritage: "GB", currentClub: "Featherstone Lions", image: "/lovable-uploads/a2d09cab-2bb3-49ff-9913-9d7108a38278.png" },
        { number: "4", name: "Ad Morley", position: "Centre", countryHeritage: "DE" },
        { number: "6", name: "Lewis Wilson", position: "Centre", countryHeritage: "GB", currentClub: "Bentley" },
        { number: "2", name: "Marcél Schlicht", position: "None", countryHeritage: "CH", currentClub: "None", role: "Sponsor", image: "/lovable-uploads/b469f12d-4b0e-4ec7-a440-89ef8e502500.png" },
      ];

      for (const player of exilesPlayers) {
        const playerNumber = player.number ? parseInt(player.number) : null;
        await createPlayer({
          name: player.name,
          number: playerNumber,
          position: player.position,
          team: 'exiles9s',
          heritage: player.countryHeritage === "DE" ? "German" : player.countryHeritage === "GB" ? "British" : "Swiss",
          club: player.currentClub && player.currentClub !== "None" ? player.currentClub : null,
          bio: player.role ? `Role: ${player.role}` : null,
          photo_url: player.image || null,
        });
      }
      
      return { success: true, message: "Players imported successfully" };
    }
    
    return { success: false, message: "Players already exist in the database" };
  } catch (error: any) {
    console.error("Error importing players:", error);
    return { success: false, message: error.message };
  }
}
