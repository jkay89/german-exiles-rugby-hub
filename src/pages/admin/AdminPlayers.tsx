
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

const AdminPlayers = () => {
  const { isAuthenticated } = useAdmin();
  const navigate = useNavigate();
  const [activeTeam, setActiveTeam] = useState("heritage");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);

  // Use our custom hook for player management
  const { 
    loading, 
    players, 
    loadPlayers, 
    handleAddPlayer, 
    handleUpdatePlayer 
  } = usePlayerManagement(activeTeam, () => {
    setShowAddForm(false);
    setEditingPlayer(null);
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/admin");
    } else {
      loadPlayers();
    }
  }, [isAuthenticated, navigate, activeTeam, loadPlayers]);

  const handleTeamSelect = (team: string) => {
    setActiveTeam(team);
    setShowAddForm(true);
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

        {/* Team selector for adding new players */}
        <PlayerTeamSelector onSelectTeam={handleTeamSelect} />

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
              ) : (
                <PlayersList 
                  players={players}
                  activeTeam={activeTeam}
                  onEdit={setEditingPlayer}
                  onPlayersChanged={loadPlayers}
                />
              )}
            </TabsContent>
          </Tabs>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminPlayers;
