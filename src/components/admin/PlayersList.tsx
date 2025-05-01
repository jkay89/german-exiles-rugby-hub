
import { useState } from "react";
import { Player } from "@/utils/playerUtils";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client-extensions";

interface PlayersListProps {
  players: Player[];
  activeTeam: string;
  onEdit: (player: Player) => void;
  onPlayersChanged: () => void;
}

const PlayersList = ({ players, activeTeam, onEdit, onPlayersChanged }: PlayersListProps) => {
  const { toast } = useToast();
  const [deletePlayerId, setDeletePlayerId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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

  return (
    <>
      {players.length === 0 ? (
        <p className="text-gray-400 text-center py-4">No players found. Add a player to get started.</p>
      ) : (
        <div className="overflow-x-auto">
          <Table className="w-full bg-gray-800 rounded-lg overflow-hidden">
            <TableHeader className="bg-gray-700">
              <TableRow>
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
                  <TableCell className="text-gray-300">{player.number || "-"}</TableCell>
                  <TableCell className="text-gray-300">{player.name}</TableCell>
                  <TableCell className="text-gray-300">{player.position || "-"}</TableCell>
                  <TableCell className="text-gray-300">{player.heritage || "-"}</TableCell>
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
      )}

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
    </>
  );
};

export default PlayersList;
