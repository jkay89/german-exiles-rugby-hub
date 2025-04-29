
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { useAdmin } from "@/contexts/AdminContext";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import PlayerForm from "@/components/admin/PlayerForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface Player {
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

const AdminPlayers = () => {
  const { isAuthenticated } = useAdmin();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTeam, setActiveTeam] = useState("heritage");
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [deletePlayerId, setDeletePlayerId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/admin");
    } else {
      fetchPlayers();
    }
  }, [isAuthenticated, navigate, activeTeam]);

  const fetchPlayers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('players')
        .select('*')
        .eq('team', activeTeam)
        .order('number', { ascending: true });

      if (error) throw error;
      setPlayers(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching players",
        description: error.message,
        variant: "destructive",
      });
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
      
      const { error } = await supabase
        .from('players')
        .insert([playerData]);
        
      if (error) throw error;
      
      toast({
        title: "Player added",
        description: "The player has been added successfully",
      });
      
      setShowAddForm(false);
      fetchPlayers();
    } catch (error: any) {
      toast({
        title: "Error adding player",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleUpdatePlayer = async (e: React.FormEvent<HTMLFormElement>) => {
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
        team: activeTeam,
        heritage: formData.get('heritage') as string || null,
        club: formData.get('club') as string || null,
        bio: formData.get('bio') as string || null,
        photo_url: photoUrl,
      };
      
      const { error } = await supabase
        .from('players')
        .update(playerData)
        .eq('id', editingPlayer.id);
        
      if (error) throw error;
      
      toast({
        title: "Player updated",
        description: "The player has been updated successfully",
      });
      
      setEditingPlayer(null);
      fetchPlayers();
    } catch (error: any) {
      toast({
        title: "Error updating player",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDeletePlayer = async () => {
    if (!deletePlayerId) return;
    
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('players')
        .delete()
        .eq('id', deletePlayerId);
        
      if (error) throw error;
      
      toast({
        title: "Player deleted",
        description: "The player has been deleted successfully",
      });
      
      setDeletePlayerId(null);
      fetchPlayers();
    } catch (error: any) {
      toast({
        title: "Error deleting player",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="pt-16 min-h-screen bg-black">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-6 py-12"
      >
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Players Management</h1>
          <Link to="/admin/dashboard">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>

        <div className="bg-gray-900 p-6 rounded-lg border border-gray-800 mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Add New Player</h2>
          <p className="text-gray-400 mb-4">Create a new player profile for Heritage Team, Community Team, or Exiles 9s.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              className="bg-german-red hover:bg-german-gold" 
              onClick={() => {
                setActiveTeam("heritage");
                setShowAddForm(true);
              }}
            >
              Add to Heritage Team
            </Button>
            <Button 
              className="bg-german-red hover:bg-german-gold"
              onClick={() => {
                setActiveTeam("community");
                setShowAddForm(true);
              }}
            >
              Add to Community Team
            </Button>
            <Button 
              className="bg-german-red hover:bg-german-gold"
              onClick={() => {
                setActiveTeam("exiles9s");
                setShowAddForm(true);
              }}
            >
              Add to Exiles 9s
            </Button>
          </div>
        </div>

        {showAddForm && (
          <div className="bg-gray-900 p-6 rounded-lg border border-gray-800 mb-8">
            <h2 className="text-xl font-bold text-white mb-4">
              Add Player to {activeTeam === "heritage" ? "Heritage Team" : 
                            activeTeam === "community" ? "Community Team" : "Exiles 9s"}
            </h2>
            <PlayerForm 
              isEditing={false} 
              onSubmit={handleAddPlayer} 
              onCancel={() => setShowAddForm(false)}
              initialValues={{team: activeTeam}}
            />
          </div>
        )}

        {editingPlayer && (
          <div className="bg-gray-900 p-6 rounded-lg border border-gray-800 mb-8">
            <h2 className="text-xl font-bold text-white mb-4">Edit Player</h2>
            <PlayerForm 
              isEditing={true} 
              onSubmit={handleUpdatePlayer} 
              onCancel={() => setEditingPlayer(null)}
              initialValues={editingPlayer}
            />
          </div>
        )}

        <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
          <h2 className="text-xl font-bold text-white mb-4">Manage Existing Players</h2>
          
          <Tabs 
            defaultValue="heritage" 
            value={activeTeam}
            onValueChange={(value) => {
              setActiveTeam(value);
              setShowAddForm(false);
              setEditingPlayer(null);
            }}
          >
            <TabsList className="mb-4 bg-gray-800">
              <TabsTrigger value="heritage" className="data-[state=active]:bg-german-red">Heritage Team</TabsTrigger>
              <TabsTrigger value="community" className="data-[state=active]:bg-german-red">Community Team</TabsTrigger>
              <TabsTrigger value="exiles9s" className="data-[state=active]:bg-german-red">Exiles 9s</TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTeam}>
              {loading ? (
                <p className="text-gray-400 text-center py-4">Loading players...</p>
              ) : players.length === 0 ? (
                <p className="text-gray-400 text-center py-4">No players found. Add a player to get started.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-gray-800 rounded-lg overflow-hidden">
                    <thead className="bg-gray-700">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-white">Number</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-white">Name</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-white">Position</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-white">Heritage</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-white">Club</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-white">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {players.map((player) => (
                        <tr key={player.id}>
                          <td className="px-4 py-3 text-sm text-gray-300">{player.number || "-"}</td>
                          <td className="px-4 py-3 text-sm text-gray-300">{player.name}</td>
                          <td className="px-4 py-3 text-sm text-gray-300">{player.position || "-"}</td>
                          <td className="px-4 py-3 text-sm text-gray-300">{player.heritage || "-"}</td>
                          <td className="px-4 py-3 text-sm text-gray-300">{player.club || "-"}</td>
                          <td className="px-4 py-3 text-sm text-gray-300">
                            <div className="flex gap-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => setEditingPlayer(player)}
                              >
                                Edit
                              </Button>
                              <Button 
                                size="sm" 
                                variant="destructive"
                                onClick={() => setDeletePlayerId(player.id)}
                              >
                                Delete
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </motion.div>

      <AlertDialog open={!!deletePlayerId} onOpenChange={(open) => !open && setDeletePlayerId(null)}>
        <AlertDialogContent className="bg-gray-900 text-white border border-gray-800">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this player?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              This action cannot be undone. This will permanently delete the player and remove their data from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-800 text-white hover:bg-gray-700">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeletePlayer} 
              className="bg-red-600 hover:bg-red-700"
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminPlayers;
