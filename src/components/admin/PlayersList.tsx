
import { useMemo, useState } from "react";
import { Player } from "@/utils/playerUtils";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client-extensions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2 } from "lucide-react";

interface PlayersListProps {
  players: Player[];
  activeTeam: string;
  onEdit: (player: Player) => void;
  onPlayersChanged: () => void;
  loading: boolean;
}

const PlayersList = ({ players, activeTeam, onEdit, onPlayersChanged, loading }: PlayersListProps) => {
  const { toast } = useToast();
  const [deletePlayerId, setDeletePlayerId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Use useMemo to prevent unnecessary re-renders of the flag icons
  const getFlagIcon = useMemo(() => (heritage: string | null) => {
    if (heritage === "DE" || heritage?.toLowerCase() === "german") {
      return "/lovable-uploads/8765443e-9005-4411-b6f9-6cf0bbf78182.png";
    } else if (heritage === "GB" || heritage?.toLowerCase() === "british") {
      return "/lovable-uploads/a18e25c3-ea1c-4820-a9a0-900357680eeb.png";
    }
    return null;
  }, []);

  const handleDeletePlayer = async () => {
    if (!deletePlayerId) return;
    
    setIsDeleting(true);
    try {
      const { error } = await supabase.rest
        .from('players')
        .delete()
        .eq('id', deletePlayerId);
        
      if (error) throw error;
      
      toast({
        title: "Player deleted",
        description: "The player has been deleted successfully",
      });
      
      setDeletePlayerId(null);
      onPlayersChanged();
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

  if (loading) {
    return (
      <div className="w-full py-10 flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-german-red mb-2" />
        <p className="text-gray-400 text-center">Loading players...</p>
      </div>
    );
  }

  if (players.length === 0) {
    return <p className="text-gray-400 text-center py-4">No players found. Add a player to get started.</p>;
  }

  return (
    <>
      <div className="overflow-x-auto">
        <Table className="w-full bg-gray-800 rounded-lg overflow-hidden">
          <TableHeader className="bg-gray-700">
            <TableRow>
              <TableHead className="text-white">Photo</TableHead>
              <TableHead className="text-white">Number</TableHead>
              <TableHead className="text-white">Name</TableHead>
              <TableHead className="text-white">Position</TableHead>
              <TableHead className="text-white">Heritage</TableHead>
              <TableHead className="text-white">Club</TableHead>
              <TableHead className="text-white">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-700">
            {players.map((player) => (
              <TableRow key={player.id}>
                <TableCell className="text-gray-300">
                  <Avatar className="h-10 w-10">
                    {player.photo_url ? (
                      <AvatarImage src={player.photo_url} alt={player.name} />
                    ) : (
                      <AvatarFallback className="bg-german-red text-white">
                        {player.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    )}
                  </Avatar>
                </TableCell>
                <TableCell className="text-gray-300">
                  {player.number ? `#${String(player.number).padStart(3, '0')}` : "-"} 
                  {player.national_number && (
                    <div className="text-xs text-gray-500 mt-1">{player.national_number}</div>
                  )}
                </TableCell>
                <TableCell className="text-gray-300">{player.name}</TableCell>
                <TableCell className="text-gray-300">{player.position || "-"}</TableCell>
                <TableCell className="text-gray-300">
                  <div className="flex items-center gap-2">
                    {player.heritage && getFlagIcon(player.heritage) && (
                      <img 
                        src={getFlagIcon(player.heritage)} 
                        alt={`${player.heritage} Flag`} 
                        className="w-6 h-4 object-cover rounded"
                      />
                    )}
                    {player.heritage || "-"}
                  </div>
                </TableCell>
                <TableCell className="text-gray-300">{player.club || "-"}</TableCell>
                <TableCell className="text-gray-300">
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => onEdit(player)}
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
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

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
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default PlayersList;
