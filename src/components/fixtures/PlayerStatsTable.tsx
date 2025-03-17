
import { useState } from "react";
import { Search, Star, CalendarCheck, Trophy, Zap, Shield } from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { PlayerStats } from "@/utils/playerStats";

interface PlayerStatsTableProps {
  playerStats: PlayerStats[];
}

const PlayerStatsTable = ({ playerStats }: PlayerStatsTableProps) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  // Filter players based on search query
  const filteredPlayers = playerStats.filter(player => 
    player.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="mt-12">
      <div className="bg-black border border-german-red rounded-lg p-6 hover:border-german-gold transition-colors duration-300">
        <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-2">
          <Star className="h-6 w-6 text-german-gold" /> Player Statistics
        </h2>
        
        <div className="mb-6 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <Input 
            type="search" 
            placeholder="Find player..." 
            className="pl-10 bg-gray-900 border-gray-700 text-white w-full md:w-1/3" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <ScrollArea className="h-80">
          <div className="overflow-x-auto">
            <Table className="w-full text-white">
              <TableHeader className="bg-gray-900 sticky top-0 z-10">
                <TableRow>
                  <TableHead className="text-white">Player</TableHead>
                  <TableHead className="text-white">Position</TableHead>
                  <TableHead className="text-white text-center">
                    <div className="flex flex-col items-center">
                      <CalendarCheck className="h-4 w-4 mb-1" />
                      <span>Games</span>
                    </div>
                  </TableHead>
                  <TableHead className="text-white text-center">
                    <div className="flex flex-col items-center">
                      <Trophy className="h-4 w-4 mb-1" />
                      <span>Tries</span>
                    </div>
                  </TableHead>
                  <TableHead className="text-white text-center">
                    <div className="flex flex-col items-center">
                      <Zap className="h-4 w-4 mb-1" />
                      <span>Points</span>
                    </div>
                  </TableHead>
                  <TableHead className="text-white text-center">
                    <div className="flex flex-col items-center">
                      <Shield className="h-4 w-4 mb-1 text-yellow-400" />
                      <span>Yellow</span>
                    </div>
                  </TableHead>
                  <TableHead className="text-white text-center">
                    <div className="flex flex-col items-center">
                      <Shield className="h-4 w-4 mb-1 text-red-500" />
                      <span>Red</span>
                    </div>
                  </TableHead>
                  <TableHead className="text-white text-center">
                    <div className="flex flex-col items-center">
                      <Star className="h-4 w-4 mb-1 text-german-gold" />
                      <span>MotM</span>
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPlayers.length > 0 ? (
                  filteredPlayers.map((player, index) => (
                    <TableRow 
                      key={player.id}
                      className={index % 2 === 0 ? "bg-gray-800/40" : "bg-gray-900/40"}
                    >
                      <TableCell className="font-medium">{player.name}</TableCell>
                      <TableCell>{player.position}</TableCell>
                      <TableCell className="text-center">{player.gamesPlayed}</TableCell>
                      <TableCell className="text-center">{player.trysScored}</TableCell>
                      <TableCell className="text-center">{player.pointsScored}</TableCell>
                      <TableCell className="text-center">{player.yellowCards}</TableCell>
                      <TableCell className="text-center">{player.redCards}</TableCell>
                      <TableCell className="text-center">{player.manOfTheMatch}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <p className="text-gray-400">No players found matching "{searchQuery}"</p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default PlayerStatsTable;
