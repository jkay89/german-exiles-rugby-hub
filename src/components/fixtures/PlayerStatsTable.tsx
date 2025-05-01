
import React, { useState, useEffect } from "react";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
  TableBody,
} from "@/components/ui/table";
import { getPlayerStats, PlayerStats } from "@/utils/playerStats";
import StatsTableContent from "./StatsTableContent";
import { LoadingState } from "./FixtureStates";

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
        <LoadingState message="Loading player statistics..." />
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
              <StatsTableContent playerStats={playerStats} />
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default PlayerStatsTable;
