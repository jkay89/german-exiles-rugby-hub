
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlayerStats } from "@/utils/playerStats";
import { Player } from "@/utils/playerUtils";
import { useToast } from "@/components/ui/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface PlayerStatsFormProps {
  onSubmit: (stats: Partial<PlayerStats>) => Promise<void>;
  onCancel: () => void;
  initialStats?: Partial<PlayerStats>;
  players: Player[];
}

const PlayerStatsForm = ({ onSubmit, onCancel, initialStats, players }: PlayerStatsFormProps) => {
  const { toast } = useToast();
  const [stats, setStats] = useState<Partial<PlayerStats>>(initialStats || {
    gamesPlayed: 0,
    trysScored: 0,
    pointsScored: 0,
    yellowCards: 0,
    redCards: 0,
    manOfTheMatch: 0,
  });
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>(initialStats?.playerId || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get selected player details
  const selectedPlayer = players.find(p => p.id === selectedPlayerId);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setStats(prev => ({
      ...prev,
      [name]: parseInt(value) || 0
    }));
  };

  const handlePlayerSelect = (playerId: string) => {
    setSelectedPlayerId(playerId);
    // Find if player already has stats
    const playerWithStats = players.find(p => p.id === playerId);
    if (playerWithStats) {
      setStats(prev => ({
        ...prev,
        playerId: playerId,
        name: playerWithStats.name,
        position: playerWithStats.position || "",
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPlayerId) {
      toast({
        title: "Error",
        description: "Please select a player",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Include player ID and name in the stats
      const playerData = players.find(p => p.id === selectedPlayerId);
      const statsToSubmit = {
        ...stats,
        playerId: selectedPlayerId,
        name: playerData?.name || "",
        position: playerData?.position || ""
      };
      
      await onSubmit(statsToSubmit);
      
      toast({
        title: "Success",
        description: "Player stats updated successfully",
      });
    } catch (error) {
      console.error("Error updating stats:", error);
      toast({
        title: "Error",
        description: "Failed to update player stats",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <Label className="text-gray-400">Select Player</Label>
          <Select 
            value={selectedPlayerId} 
            onValueChange={handlePlayerSelect}
            required
          >
            <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
              <SelectValue placeholder="Select a player" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 text-white max-h-80">
              {players.map((player) => (
                <SelectItem key={player.id} value={player.id}>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      {player.photo_url ? (
                        <AvatarImage src={player.photo_url} alt={player.name} />
                      ) : (
                        <AvatarFallback className="bg-german-red text-white text-xs">
                          {player.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <span>
                      {player.number && `#${player.number} `}{player.name}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedPlayer && (
          <div className="md:col-span-2 flex items-center gap-4 p-3 bg-gray-800 rounded-md">
            <Avatar className="h-12 w-12">
              {selectedPlayer.photo_url ? (
                <AvatarImage src={selectedPlayer.photo_url} alt={selectedPlayer.name} />
              ) : (
                <AvatarFallback className="bg-german-red text-white">
                  {selectedPlayer.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              )}
            </Avatar>
            <div>
              <h3 className="font-semibold text-white">{selectedPlayer.name}</h3>
              <p className="text-gray-400 text-sm">
                {selectedPlayer.number && `#${selectedPlayer.number} • `}
                {selectedPlayer.position || "Position not set"} • 
                {selectedPlayer.team === "heritage" ? " Heritage Team" : 
                 selectedPlayer.team === "exiles9s" ? " Exiles 9s" : " Community Team"}
              </p>
            </div>
          </div>
        )}

        <div>
          <Label className="text-gray-400">Games Played</Label>
          <Input
            name="gamesPlayed"
            type="number"
            min="0"
            value={stats.gamesPlayed}
            onChange={handleInputChange}
            className="bg-gray-800 border-gray-700 text-white"
          />
        </div>

        <div>
          <Label className="text-gray-400">Trys Scored</Label>
          <Input
            name="trysScored"
            type="number"
            min="0"
            value={stats.trysScored}
            onChange={handleInputChange}
            className="bg-gray-800 border-gray-700 text-white"
          />
        </div>

        <div>
          <Label className="text-gray-400">Points Scored</Label>
          <Input
            name="pointsScored"
            type="number"
            min="0"
            value={stats.pointsScored}
            onChange={handleInputChange}
            className="bg-gray-800 border-gray-700 text-white"
          />
        </div>

        <div>
          <Label className="text-gray-400">Yellow Cards</Label>
          <Input
            name="yellowCards"
            type="number"
            min="0"
            value={stats.yellowCards}
            onChange={handleInputChange}
            className="bg-gray-800 border-gray-700 text-white"
          />
        </div>

        <div>
          <Label className="text-gray-400">Red Cards</Label>
          <Input
            name="redCards"
            type="number"
            min="0"
            value={stats.redCards}
            onChange={handleInputChange}
            className="bg-gray-800 border-gray-700 text-white"
          />
        </div>

        <div>
          <Label className="text-gray-400">Man of the Match</Label>
          <Input
            name="manOfTheMatch"
            type="number"
            min="0"
            value={stats.manOfTheMatch}
            onChange={handleInputChange}
            className="bg-gray-800 border-gray-700 text-white"
          />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          className="bg-german-red hover:bg-german-gold" 
          disabled={isSubmitting || !selectedPlayerId}
        >
          {isSubmitting ? "Saving..." : "Save Stats"}
        </Button>
      </div>
    </form>
  );
};

export default PlayerStatsForm;
