
import { motion } from "framer-motion";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect, useState } from "react";
import { fetchPlayersByTeam, Player } from "@/utils/playerUtils";
import { Loader2 } from "lucide-react";

const Exiles9s = () => {
  const { t } = useLanguage();
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadPlayers = async () => {
      setLoading(true);
      try {
        const data = await fetchPlayersByTeam("exiles9s");
        setPlayers(data);
      } catch (error) {
        console.error("Error loading exiles9s team players:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadPlayers();
  }, []);

  // Extract the role from the bio field
  const getPlayerRole = (bio: string | null): string | null => {
    if (!bio) return null;
    const roleMatch = bio.match(/Role: (.*)/);
    return roleMatch ? roleMatch[1] : null;
  };

  // Function to get the correct flag based on heritage
  const getHeritageFlag = (heritage: string | null): string | null => {
    if (!heritage) return null;
    
    const heritageLower = heritage.toLowerCase();
    
    if (heritageLower === "de" || heritageLower === "german") {
      return "/lovable-uploads/8765443e-9005-4411-b6f9-6cf0bbf78182.png";
    } else if (heritageLower === "gb" || heritageLower === "british") {
      return "/lovable-uploads/a18e25c3-ea1c-4820-a9a0-900357680eeb.png";
    } else if (heritageLower === "ch" || heritageLower === "swiss") {
      return "https://upload.wikimedia.org/wikipedia/commons/f/f3/Flag_of_Switzerland.svg";
    }
    
    return null;
  };

  return (
    <div className="pt-16 min-h-screen bg-black">
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative py-16 bg-black text-white overflow-hidden"
      >
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-48 h-48 md:w-64 md:h-64 opacity-10">
          <img 
            src="/lovable-uploads/d5497b13-60f3-4490-9abb-bc42b3027140.png" 
            alt={t("german_exiles_logo")}
            className="w-full h-full object-contain"
          />
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <h1 className="text-4xl font-bold mb-4 text-german-gold text-center">{t("exiles_9s")}</h1>
          
          <div className="flex flex-col md:flex-row items-center justify-center mb-10 gap-8">
            <p className="text-gray-300 max-w-2xl text-center">
              {t("exiles_9s_description")}
            </p>
          </div>
        </div>
      </motion.section>

      <section className="py-16 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-6">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-12 w-12 text-german-gold animate-spin" />
            </div>
          ) : (
            <div className="text-white">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {players.map((player, index) => (
                  <div key={player.id} className="bg-gray-800 p-4 rounded border border-german-gold flex gap-4">
                    <div className="flex-1">
                      <h3 className="text-german-gold font-bold">#{player.number} {player.name}</h3>
                      <p className="text-gray-300">{player.position}</p>
                      <p className="text-gray-400">{player.club}</p>
                      <p className="text-gray-400">Heritage: {player.heritage}</p>
                    </div>
                    {player.photo_url && (
                      <div className="w-24 h-24 flex-shrink-0">
                        <img src={player.photo_url} alt={player.name} className="w-full h-full object-cover rounded" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Exiles9s;
