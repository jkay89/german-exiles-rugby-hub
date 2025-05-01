
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { PlayerStats, getPlayerStats, getPlayerStatsById, savePlayerStats } from "@/utils/playerStats";

export const usePlayerStatsManagement = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [playerStats, setPlayerStats] = useState<PlayerStats[]>([]);

  const loadPlayerStats = async () => {
    setLoading(true);
    try {
      const stats = await getPlayerStats();
      setPlayerStats(stats);
    } catch (error: any) {
      toast({
        title: "Error fetching player stats",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadPlayerStatsById = async (id: string): Promise<PlayerStats | null> => {
    setLoading(true);
    try {
      const stats = await getPlayerStatsById(id);
      return stats;
    } catch (error: any) {
      toast({
        title: "Error fetching player stats",
        description: error.message,
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleSaveStats = async (stats: Partial<PlayerStats>): Promise<void> => {
    setLoading(true);
    try {
      await savePlayerStats(stats);
      
      // Refresh player stats
      await loadPlayerStats();
      
      toast({
        title: "Stats updated",
        description: "The player stats have been updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error updating stats",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    playerStats,
    loadPlayerStats,
    loadPlayerStatsById,
    handleSaveStats
  };
};
