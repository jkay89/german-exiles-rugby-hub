
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { useAdmin } from "@/contexts/AdminContext";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PlayerForm from "@/components/admin/PlayerForm";
import PlayersList from "@/components/admin/PlayersList";
import PlayerTeamSelector from "@/components/admin/PlayerTeamSelector";
import { usePlayerManagement } from "@/hooks/usePlayerManagement";
import { Player } from "@/utils/playerUtils";
import { supabase } from "@/integrations/supabase/client-extensions";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { UploadCloud, LineChart } from "lucide-react";
import PlayerStatsForm from "@/components/admin/PlayerStatsForm";
import { usePlayerStatsManagement } from "@/hooks/usePlayerStatsManagement";
import { PlayerStats } from "@/utils/playerStats";

const AdminPlayers = () => {
  const { isAuthenticated } = useAdmin();
  const navigate = useNavigate();
  const [activeTeam, setActiveTeam] = useState("heritage");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showExilesImportDialog, setShowExilesImportDialog] = useState(false);
  const [activeView, setActiveView] = useState<"manage" | "stats">("manage");
  const [showStatsForm, setShowStatsForm] = useState(false);
  const [editingStats, setEditingStats] = useState<PlayerStats | null>(null);
  const [allPlayers, setAllPlayers] = useState<Player[]>([]);

  // Use our custom hooks for player management
  const { 
    loading, 
    players, 
    loadPlayers, 
    handleAddPlayer, 
    handleUpdatePlayer,
    importHeritageTeam,
    importExiles9sTeam
  } = usePlayerManagement(activeTeam, () => {
    setShowAddForm(false);
    setEditingPlayer(null);
  });

  // Use our custom hook for player stats management
  const {
    loading: statsLoading,
    playerStats,
    loadPlayerStats,
    handleSaveStats
  } = usePlayerStatsManagement();

  // Load all players for stats management
  const loadAllPlayers = async () => {
    try {
      const { data, error } = await supabase.rest
        .from('players')
        .select('*')
        .order('name');
        
      if (error) throw error;
      setAllPlayers(data || []);
    } catch (error) {
      console.error('Error loading all players:', error);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/admin");
    } else {
      // Check if storage bucket exists, create if it doesn't
      const ensureStorageBucket = async () => {
        try {
          const { data: buckets } = await supabase.storage.listBuckets();
          const playersBucketExists = buckets?.some(bucket => bucket.name === 'players');
          
          if (!playersBucketExists) {
            console.log('Creating players storage bucket...');
            await supabase.storage.createBucket('players', {
              public: true,
              fileSizeLimit: 10485760, // 10MB
              allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/gif']
            });
            console.log('Players storage bucket created successfully');
          }
        } catch (error) {
          console.error('Error checking/creating storage bucket:', error);
        }
      };
      
      ensureStorageBucket();
      
      // Load initial data
      loadPlayers();
      loadPlayerStats();
      loadAllPlayers();
    }
  }, [isAuthenticated, navigate]);

  const handleTeamSelect = (team: string) => {
    setActiveTeam(team);
    setShowAddForm(true);
  };

  const handleTeamChange = (value: string) => {
    // First update the active team state
    setActiveTeam(value);
    
    // Reset form states to avoid showing stale data
    setShowAddForm(false);
    setEditingPlayer(null);
    
    // Load players for the new team after the state has been updated
    // We're explicitly passing the new team value to ensure we're loading the correct data
    setTimeout(() => {
      loadPlayers();
    }, 50);
  };

  const handleImport = async () => {
    await importHeritageTeam();
    setShowImportDialog(false);
  };

  const handleImportExiles = async () => {
    await importExiles9sTeam();
    setShowExilesImportDialog(false);
  };

  const handleAddStats = () => {
    setEditingStats(null);
    setShowStatsForm(true);
  };

  const handleSavePlayerStats = async (stats: Partial<PlayerStats>) => {
    await handleSaveStats(stats);
    setShowStatsForm(false);
    setEditingStats(null);
  };

  const handleEditStats = (stats: PlayerStats) => {
    setEditingStats(stats);
    setShowStatsForm(true);
  };

  const handleTabChange = (value: string) => {
    setActiveView(value as "manage" | "stats");
    
    if (value === "stats") {
      // Load stats-related data
      loadAllPlayers();
      loadPlayerStats();
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

        {/* Main tabs (Manage Players / Player Stats) */}
        <Tabs 
          defaultValue="manage" 
          value={activeView} 
          onValueChange={handleTabChange} 
          className="mb-8"
        >
          <TabsList className="bg-gray-800">
            <TabsTrigger value="manage" className="data-[state=active]:bg-german-red">
              Manage Players
            </TabsTrigger>
            <TabsTrigger value="stats" className="data-[state=active]:bg-german-red">
              Player Stats
            </TabsTrigger>
          </TabsList>

          <TabsContent value="manage">
            {/* Team selector for adding new players */}
            <PlayerTeamSelector onSelectTeam={handleTeamSelect} />

            {/* Import heritage team button (only visible when heritage team is selected) */}
            {activeTeam === "heritage" && (
              <div className="mt-4 mb-6">
                <AlertDialog open={showImportDialog} onOpenChange={setShowImportDialog}>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="flex items-center gap-2 border-german-gold text-german-gold hover:bg-german-gold/10"
                    >
                      <UploadCloud size={16} />
                      Import Official Heritage Team
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-gray-900 text-white border-gray-700">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Import Heritage Team Data</AlertDialogTitle>
                      <AlertDialogDescription className="text-gray-400">
                        This will replace all existing heritage team players with the official lineup. 
                        This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="bg-gray-800 text-white hover:bg-gray-700">Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={handleImport} 
                        className="bg-german-red hover:bg-german-gold"
                      >
                        Import Team
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                <p className="text-gray-400 text-xs mt-2">
                  Import the official heritage team data, including all player information.
                </p>
              </div>
            )}

            {/* Import exiles9s team button (only visible when exiles9s team is selected) */}
            {activeTeam === "exiles9s" && (
              <div className="mt-4 mb-6">
                <AlertDialog open={showExilesImportDialog} onOpenChange={setShowExilesImportDialog}>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="flex items-center gap-2 border-german-gold text-german-gold hover:bg-german-gold/10"
                    >
                      <UploadCloud size={16} />
                      Import Official Exiles 9s Team
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-gray-900 text-white border-gray-700">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Import Exiles 9s Team Data</AlertDialogTitle>
                      <AlertDialogDescription className="text-gray-400">
                        This will replace all existing Exiles 9s team players with the official lineup. 
                        This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="bg-gray-800 text-white hover:bg-gray-700">Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={handleImportExiles} 
                        className="bg-german-red hover:bg-german-gold"
                      >
                        Import Team
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                <p className="text-gray-400 text-xs mt-2">
                  Import the official Exiles 9s team data, including all player information.
                </p>
              </div>
            )}

            {/* Add player form */}
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

            {/* Edit player form */}
            {editingPlayer && (
              <div className="bg-gray-900 p-6 rounded-lg border border-gray-800 mb-8">
                <h2 className="text-xl font-bold text-white mb-4">Edit Player</h2>
                <PlayerForm 
                  isEditing={true} 
                  onSubmit={(e) => handleUpdatePlayer(e, editingPlayer)} 
                  onCancel={() => setEditingPlayer(null)}
                  initialValues={editingPlayer}
                />
              </div>
            )}

            {/* Player management tabs and list */}
            <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
              <h2 className="text-xl font-bold text-white mb-4">Manage Existing Players</h2>
              
              <Tabs 
                defaultValue="heritage" 
                value={activeTeam}
                onValueChange={handleTeamChange}
              >
                <TabsList className="mb-4 bg-gray-800">
                  <TabsTrigger value="heritage" className="data-[state=active]:bg-german-red">Heritage Team</TabsTrigger>
                  <TabsTrigger value="community" className="data-[state=active]:bg-german-red">Community Team</TabsTrigger>
                  <TabsTrigger value="exiles9s" className="data-[state=active]:bg-german-red">Exiles 9s</TabsTrigger>
                </TabsList>
                
                <TabsContent value={activeTeam}>
                  <PlayersList 
                    players={players}
                    activeTeam={activeTeam}
                    onEdit={setEditingPlayer}
                    onPlayersChanged={loadPlayers}
                    loading={loading}
                  />
                </TabsContent>
              </Tabs>
            </div>
          </TabsContent>

          <TabsContent value="stats">
            <div className="bg-gray-900 p-6 rounded-lg border border-gray-800 mb-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">Player Statistics</h2>
                <Button 
                  onClick={handleAddStats}
                  className="bg-german-red hover:bg-german-gold flex items-center gap-2"
                >
                  <LineChart size={16} />
                  Update Player Stats
                </Button>
              </div>
              
              {showStatsForm && (
                <div className="mb-8 p-6 border border-gray-700 rounded-lg bg-gray-800">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    {editingStats ? "Edit Player Statistics" : "Add Player Statistics"}
                  </h3>
                  <PlayerStatsForm
                    onSubmit={handleSavePlayerStats}
                    onCancel={() => setShowStatsForm(false)}
                    initialStats={editingStats || undefined}
                    players={allPlayers}
                  />
                </div>
              )}
              
              {/* Player Stats Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-gray-400 uppercase bg-gray-800">
                    <tr>
                      <th className="px-4 py-3">Player</th>
                      <th className="px-4 py-3">Team</th>
                      <th className="px-4 py-3">Games</th>
                      <th className="px-4 py-3">Trys</th>
                      <th className="px-4 py-3">Points</th>
                      <th className="px-4 py-3">Yellow Cards</th>
                      <th className="px-4 py-3">Red Cards</th>
                      <th className="px-4 py-3">MotM</th>
                      <th className="px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {statsLoading ? (
                      <tr>
                        <td colSpan={9} className="px-4 py-8 text-center text-gray-400">
                          Loading player statistics...
                        </td>
                      </tr>
                    ) : playerStats.length > 0 ? (
                      playerStats.map((stat) => {
                        // Find the player to get their team
                        const player = allPlayers.find(p => p.id === stat.playerId);
                        
                        return (
                          <tr key={stat.id} className="bg-gray-900 border-b border-gray-800">
                            <td className="px-4 py-3 text-white">
                              <div className="flex items-center">
                                <div className="font-medium">{stat.name}</div>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-white">
                              {player?.team === "heritage" ? "Heritage Team" : 
                              player?.team === "exiles9s" ? "Exiles 9s" : "Community Team"}
                            </td>
                            <td className="px-4 py-3 text-white">{stat.gamesPlayed}</td>
                            <td className="px-4 py-3 text-white">{stat.trysScored}</td>
                            <td className="px-4 py-3 text-white">{stat.pointsScored}</td>
                            <td className="px-4 py-3 text-white">{stat.yellowCards}</td>
                            <td className="px-4 py-3 text-white">{stat.redCards}</td>
                            <td className="px-4 py-3 text-white">{stat.manOfTheMatch}</td>
                            <td className="px-4 py-3">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleEditStats(stat)}
                                className="text-gray-400 hover:text-white"
                              >
                                Edit
                              </Button>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={9} className="px-4 py-8 text-center text-gray-400">
                          No player statistics found. Click "Update Player Stats" to add statistics.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default AdminPlayers;
