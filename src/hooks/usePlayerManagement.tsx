
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client-extensions";
import { Player } from "@/utils/playerUtils";

export const usePlayerManagement = (activeTeam: string, onSuccess: () => void) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [players, setPlayers] = useState<Player[]>([]);

  const loadPlayers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.rest
        .from('players')
        .select('*')
        .eq('team', activeTeam)
        .order('number', { ascending: true })
        .order('name');
        
      if (error) throw error;
      
      console.log(`Found ${data?.length || 0} players for team ${activeTeam}:`, data);
      setPlayers(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching players",
        description: error.message,
        variant: "destructive",
      });
      setPlayers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPlayer = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      // Handle file upload if there's a photo
      const photoFile = formData.get('photo') as File;
      let photoUrl = null;
      
      if (photoFile && photoFile.name) {
        const fileExt = photoFile.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('players')
          .upload(fileName, photoFile);
          
        if (uploadError) throw uploadError;
        
        const { data } = supabase.storage
          .from('players')
          .getPublicUrl(fileName);
          
        photoUrl = data.publicUrl;
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
      };
      
      const { data, error } = await supabase.rest
        .from('players')
        .insert(playerData)
        .select();
        
      if (error) throw error;
      
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
      // Handle file upload if there's a photo
      const photoFile = formData.get('photo') as File;
      let photoUrl = editingPlayer.photo_url;
      
      if (photoFile && photoFile.name) {
        const fileExt = photoFile.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('players')
          .upload(fileName, photoFile);
          
        if (uploadError) throw uploadError;
        
        const { data } = supabase.storage
          .from('players')
          .getPublicUrl(fileName);
          
        photoUrl = data.publicUrl;
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

  return {
    loading,
    players,
    loadPlayers,
    handleAddPlayer,
    handleUpdatePlayer
  };
};
