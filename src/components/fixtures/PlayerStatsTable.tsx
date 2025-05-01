
import React, { useState, useEffect } from "react";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2 } from "lucide-react";
import { getPlayerStats, PlayerStats } from "@/utils/playerStats";

const PlayerStatsTable = () => {
  const [playerStats, setPlayerStats] = useState<PlayerStats[]>([]);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    const fetchPlayerStats = async () => {
      setStatsLoading(true);
      try {
        console.log("Fetching player stats");
        const stats = await getPlayerStats();
        console.log("Player stats received:", stats);
        setPlayerStats(stats);
      } catch (error) {
        console.error("Error loading player stats:", error);
      } finally {
        setStatsLoading(false);
      }
    };
    
    fetchPlayerStats();
  }, []);

  return (
    <div className="mt-12">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-white">Player Statistics</h2>
        <div className="px-3 py-1 bg-gray-800 text-xs font-medium text-gray-300 rounded-full">
          2024-25 Season
        </div>
      </div>
      <Separator className="mb-6 bg-gray-700" />
      
      {statsLoading ? (
        <div className="flex justify-center items-center py-12 bg-gray-900 rounded-lg border border-gray-800">
          <Loader2 className="w-8 h-8 text-german-gold animate-spin mr-2" />
          <p className="text-center text-gray-400">Loading player statistics...</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-gradient-to-b from-gray-900 to-gray-800 rounded-lg p-4 border border-gray-700">
          <Table>
            <TableCaption>A list of player statistics for the current season.</TableCaption>
            <TableHeader>
              <TableRow className="border-b border-gray-700">
                <TableHead className="text-german-gold w-[180px]">Name</TableHead>
                <TableHead className="text-german-gold">Position</TableHead>
                <TableHead className="text-german-gold text-center">Games</TableHead>
                <TableHead className="text-german-gold text-center">Trys</TableHead>
                <TableHead className="text-german-gold text-center">Points</TableHead>
                <TableHead className="text-german-gold text-center">Yellow Cards</TableHead>
                <TableHead className="text-german-gold text-center">Red Cards</TableHead>
                <TableHead className="text-german-gold text-center">MotM</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {playerStats && playerStats.length > 0 ? (
                playerStats.map((stat) => (
                  <TableRow key={stat.id} className="hover:bg-gray-800 border-b border-gray-800">
                    <TableCell className="font-medium text-white">{stat.name}</TableCell>
                    <TableCell className="text-gray-300">{stat.position || "–"}</TableCell>
                    <TableCell className="text-center text-gray-300">{stat.gamesPlayed}</TableCell>
                    <TableCell className="text-center text-gray-300">{stat.trysScored}</TableCell>
                    <TableCell className="text-center text-gray-300">{stat.pointsScored}</TableCell>
                    <TableCell className="text-center text-gray-300">{stat.yellowCards}</TableCell>
                    <TableCell className="text-center text-gray-300">{stat.redCards}</TableCell>
                    <TableCell className="text-center text-gray-300">{stat.manOfTheMatch}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-gray-400">No player statistics available.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default PlayerStatsTable;
