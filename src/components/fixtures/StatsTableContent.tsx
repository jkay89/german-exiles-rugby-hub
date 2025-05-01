
import React from "react";
import {
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { PlayerStats } from "@/utils/playerStats";

interface StatsTableContentProps {
  playerStats: PlayerStats[];
}

const StatsTableContent = ({ playerStats }: StatsTableContentProps) => {
  if (!playerStats || playerStats.length === 0) {
    return (
      <TableRow>
        <TableCell colSpan={8} className="text-center text-gray-400">No player statistics available.</TableCell>
      </TableRow>
    );
  }

  return (
    <>
      {playerStats.map((stat) => (
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
      ))}
    </>
  );
};

export default StatsTableContent;
