
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client-extensions";
import { Player } from "@/utils/playerUtils";

export const usePlayerManagement = (activeTeam: string, onSuccess: () => void) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [players, setPlayers] = useState<Player[]>([]);

  // Use useCallback to prevent recreation of this function on every render
  const loadPlayers = useCallback(async () => {
    setLoading(true);
    try {
      console.log(`Loading players for team: ${activeTeam}`);
      const { data, error } = await supabase.rest
        .from('players')
        .select('*')
        .eq('team', activeTeam)
        .order('number', { ascending: true })
        .order('name');
        
      if (error) throw error;
      
      console.log(`Found ${data?.length || 0} players for team ${activeTeam}:`, data?.map(p => ({ name: p.name, team: p.team })));
      setPlayers(data || []);
    } catch (error: any) {
      console.error(`Error loading players for team ${activeTeam}:`, error);
      toast({
        title: "Error fetching players",
        description: error.message,
        variant: "destructive",
      });
      setPlayers([]);
    } finally {
      setLoading(false);
    }
  }, [activeTeam, toast]);

  // Initial load of players when the component mounts or activeTeam changes
  useEffect(() => {
    loadPlayers();
  }, [loadPlayers]);

  const handleAddPlayer = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      let photoUrl = null;
      
      // Handle file upload if there's a selected file
      const hasSelectedFile = formData.get('selectedFile') === 'true';
      if (hasSelectedFile) {
        const photoInput = e.currentTarget.querySelector('input[name="photo"]') as HTMLInputElement;
        const file = photoInput?.files?.[0];
        
        if (file) {
          const fileExt = file.name.split('.').pop();
          const fileName = `${Date.now()}.${fileExt}`;
          
          const { error: uploadError } = await supabase.storage
            .from('players')
            .upload(fileName, file);
            
          if (uploadError) throw uploadError;
          
          const { data } = supabase.storage
            .from('players')
            .getPublicUrl(fileName);
            
          photoUrl = data.publicUrl;
        }
      }
      
      // Create the player object
      const playerData = {
        name: formData.get('name') as string,
        number: formData.get('number') ? parseInt(formData.get('number') as string) : null,
        position: formData.get('position') as string || null,
        team: activeTeam,
        heritage: formData.get('heritage') as string || null,
        club: formData.get('club') as string || null,
        bio: formData.get('bio') as string || null,
        photo_url: photoUrl,
        national_number: formData.get('national_number') as string || null,
      };
      
      console.log(`Adding player to team: ${activeTeam}`, playerData);
      
      const { data, error } = await supabase.rest
        .from('players')
        .insert(playerData)
        .select();
        
      if (error) throw error;
      
      console.log(`Player added successfully:`, data);
      
      toast({
        title: "Player added",
        description: "The player has been added successfully",
      });
      
      onSuccess();
      loadPlayers();
    } catch (error: any) {
      toast({
        title: "Error adding player",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleUpdatePlayer = async (e: React.FormEvent<HTMLFormElement>, editingPlayer: Player) => {
    e.preventDefault();
    
    if (!editingPlayer) return;
    
    const formData = new FormData(e.currentTarget);
    
    try {
      let photoUrl = editingPlayer.photo_url;
      
      // Handle file upload if there's a selected file
      const hasSelectedFile = formData.get('selectedFile') === 'true';
      if (hasSelectedFile) {
        const photoInput = e.currentTarget.querySelector('input[name="photo"]') as HTMLInputElement;
        const file = photoInput?.files?.[0];
        
        if (file) {
          const fileExt = file.name.split('.').pop();
          const fileName = `${Date.now()}.${fileExt}`;
          
          const { error: uploadError } = await supabase.storage
            .from('players')
            .upload(fileName, file);
            
          if (uploadError) throw uploadError;
          
          const { data } = supabase.storage
            .from('players')
            .getPublicUrl(fileName);
            
          photoUrl = data.publicUrl;
        }
      }
      
      // Update the player object
      const playerData = {
        name: formData.get('name') as string,
        number: formData.get('number') ? parseInt(formData.get('number') as string) : null,
        position: formData.get('position') as string || null,
        heritage: formData.get('heritage') as string || null,
        club: formData.get('club') as string || null,
        bio: formData.get('bio') as string || null,
        photo_url: photoUrl,
        national_number: formData.get('national_number') as string || null,
      };
      
      const { error } = await supabase.rest
        .from('players')
        .update(playerData)
        .eq('id', editingPlayer.id);
        
      if (error) throw error;
      
      toast({
        title: "Player updated",
        description: "The player has been updated successfully",
      });
      
      onSuccess();
      loadPlayers();
    } catch (error: any) {
      toast({
        title: "Error updating player",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const importHeritageTeam = async () => {
    setLoading(true);
    
    try {
      const heritageTeamData = [
        { number: 1, name: "Jay Kay", heritage: "DE", position: "Outside Backs", national_number: "#204", club: "Thornhill Trojans", team: "heritage" },
        { number: 2, name: "Zak Bredin", heritage: "DE", position: "Centre", national_number: "", club: "Eastern Rhinos", team: "heritage" },
        { number: 3, name: "Oliver Bowie", heritage: "DE", position: "Second Row", national_number: "#205", club: "Unaffiliated", team: "heritage" },
        { number: 4, name: "Charlie Tetley", heritage: "DE", position: "Prop", national_number: "", club: "Oulton Raiders", team: "heritage" },
        { number: 5, name: "George Wood", heritage: "DE", position: "Centre", national_number: "", club: "Eastern Rhinos", team: "heritage" },
        { number: 6, name: "Will Waring", heritage: "DE", position: "Second Row", national_number: "", club: "Unaffiliated", team: "heritage" },
        { number: 8, name: "Connor Hampson", heritage: "DE", position: "Prop", national_number: "", club: "Featherstone Lions", team: "heritage" },
        { number: 9, name: "Alex Land", heritage: "GB", position: "Prop", national_number: "", club: "Featherstone Lions", team: "heritage" },
        { number: 10, name: "Andy Hoggins", heritage: "DE", position: "Loose Forward", national_number: "", club: "Oxford Cavaliers", team: "heritage" },
        { number: 11, name: "Joe Wood", heritage: "GB", position: "Dummy Half", national_number: "", club: "Shaw Cross Sharks", team: "heritage" },
        { number: 12, name: "Jamie Billsborough", heritage: "GB", position: "Hooker", national_number: "", club: "Unaffiliated", team: "heritage" },
        { number: 13, name: "Brad Billsborough", heritage: "DE", position: "Half Back", national_number: "", club: "Midlands Hurricanes", team: "heritage" },
        { number: 15, name: "Zach Burke", heritage: "GB", position: "Centre", national_number: "", club: "Featherstone Lions", team: "heritage" },
        { number: 16, name: "Eddie Briggs", heritage: "DE", position: "Second Row", national_number: "", club: "Unaffiliated", team: "heritage" },
        { number: 17, name: "Eoin Bowie", heritage: "DE", position: "Second Row", national_number: "", club: "Nambour Crushers", team: "heritage" },
        { number: 18, name: "Joshua McConnell", heritage: "DE", position: "Loose Forward", national_number: "", club: "Wath Brow Hornets", team: "heritage" },
        { number: 19, name: "Ad Morley", heritage: "DE", position: "Centre", national_number: "", club: "Sharlston Rovers", team: "heritage" },
        { number: 20, name: "Callum Corey", heritage: "DE", position: "Second Row", national_number: "", club: "Corrimal Cougars", team: "heritage" },
        { number: 21, name: "Shaun Smith", heritage: "DE", position: "Centre", national_number: "", club: "Crigglestone All Blacks", team: "heritage" },
        { number: 22, name: "Lewis Wilson", heritage: "GB", position: "Centre", national_number: "", club: "Bentley", team: "heritage" },
        { number: 23, name: "Michael MacDonald", heritage: "DE", position: "Half Back", national_number: "", club: "Army", team: "heritage" },
        { number: 24, name: "Arron Williams", heritage: "DE", position: "Second Row", national_number: "", club: "Westgate Common", team: "heritage" },
        { number: 25, name: "Jordan Williams", heritage: "DE", position: "Prop", national_number: "", club: "Westgate Common", team: "heritage" },
        { number: 26, name: "Louis Beattie", heritage: "DE", position: "Loose Forward", national_number: "", club: "Midlands Hurricanes", team: "heritage" },
        { number: 27, name: "Michael Knight", heritage: "GB", position: "Prop", national_number: "", club: "Unaffiliated", team: "heritage" },
        { number: 28, name: "James Adams", heritage: "DE", position: "Second Row", national_number: "", club: "REME RL", team: "heritage" },
        { number: 29, name: "Dylan Burdof", heritage: "DE", position: "Wing", national_number: "", club: "Eastern Rhinos", team: "heritage" },
        { number: 30, name: "Jordan Walker", heritage: "GB", position: "Loose Forward", national_number: "", club: "Featherstone Lions", team: "heritage" },
        { number: 31, name: "Ellis Armstrong", heritage: "DE", position: "Centre", national_number: "", club: "Kings Cross Park", team: "heritage" },
        { number: 32, name: "Louis Beattie", heritage: "DE", position: "Hooker", national_number: "", club: "Midlands Hurricanes", team: "heritage" }
      ];

      // First, delete existing heritage team players
      const { error: deleteError } = await supabase.rest
        .from('players')
        .delete()
        .eq('team', 'heritage');
      
      if (deleteError) throw deleteError;
      
      // Insert the new heritage team players
      const { error: insertError } = await supabase.rest
        .from('players')
        .insert(heritageTeamData);
      
      if (insertError) throw insertError;
      
      toast({
        title: "Heritage team imported",
        description: "The heritage team has been updated successfully",
      });
      
      // Only reload if we're currently viewing the heritage team
      if (activeTeam === 'heritage') {
        loadPlayers();
      }
    } catch (error: any) {
      toast({
        title: "Error importing heritage team",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const importExiles9sTeam = async () => {
    setLoading(true);
    
    try {
      const exiles9sTeamData = [
        { number: 15, name: "Jay Kay", heritage: "DE", position: "Outside Backs", club: "Thornhill Trojans", bio: "Role: Captain", team: "exiles9s" },
        { number: 5, name: "Zak Bredin", heritage: "DE", position: "Half Back", club: "Eastern Rhinos", bio: "Role: Vice Captain", team: "exiles9s" },
        { number: 44, name: "Henning Brockmann", heritage: "DE", bio: "Role: Vice Captain", team: "exiles9s" },
        { number: 23, name: "Malte Rohrmoser", heritage: "DE", team: "exiles9s" },
        { number: 17, name: "Fabian Wendt", heritage: "DE", team: "exiles9s" },
        { number: 1, name: "Benedikt Esser", heritage: "DE", team: "exiles9s" },
        { number: 3, name: "Aaron Willmott", heritage: "DE", team: "exiles9s" },
        { number: 10, name: "Joshua McConnell", heritage: "DE", position: "Loose Forward", club: "Wath Brow Hornets", team: "exiles9s" },
        { number: 8, name: "Korbi Mayer", heritage: "DE", team: "exiles9s" },
        { number: 19, name: "Harry Cartwright", heritage: "DE", team: "exiles9s" },
        { number: 12, name: "Zach Burke", heritage: "GB", position: "Centre", club: "Featherstone Lions", team: "exiles9s" },
        { number: 4, name: "Ad Morley", heritage: "DE", position: "Centre", team: "exiles9s" },
        { number: 6, name: "Lewis Wilson", heritage: "GB", position: "Centre", club: "Bentley", team: "exiles9s" },
        { number: 2, name: "Marcél Schlicht", heritage: "CH", position: "None", club: "None", bio: "Role: Sponsor", team: "exiles9s" }
      ];

      // First, delete existing exiles9s team players
      const { error: deleteError } = await supabase.rest
        .from('players')
        .delete()
        .eq('team', 'exiles9s');
      
      if (deleteError) throw deleteError;
      
      // Insert the new exiles9s team players
      const { error: insertError } = await supabase.rest
        .from('players')
        .insert(exiles9sTeamData);
      
      if (insertError) throw insertError;
      
      toast({
        title: "Exiles 9s team imported",
        description: "The Exiles 9s team has been updated successfully",
      });
      
      // Only reload if we're currently viewing the exiles9s team
      if (activeTeam === 'exiles9s') {
        loadPlayers();
      }
    } catch (error: any) {
      toast({
        title: "Error importing Exiles 9s team",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    players,
    loadPlayers,
    handleAddPlayer,
    handleUpdatePlayer,
    importHeritageTeam,
    importExiles9sTeam
  };
};
