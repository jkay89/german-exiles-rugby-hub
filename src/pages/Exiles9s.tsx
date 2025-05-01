
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
          <h1 className="text-4xl font-bold mb-4 text-german-gold text-center">{t("schlicht_exiles_9s")}</h1>
          
          <div className="flex flex-col md:flex-row items-center justify-center mb-10 gap-8">
            <div className="w-64 h-64">
              <img 
                src="/lovable-uploads/51da26a8-d895-4a08-91d5-1c75e6c64b39.png" 
                alt={t("schlicht_exiles_9s_logo")}
                className="w-full h-full object-contain"
              />
            </div>
            <p className="text-gray-300 max-w-2xl">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {players.map((player, index) => (
                <motion.div
                  key={player.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-black border-german-red hover:border-german-gold transition-colors duration-300">
                    <CardHeader className="flex flex-col items-center">
                      <div className="flex items-center justify-center w-full mb-4 space-x-8">
                        <div className="flex flex-col items-center">
                          <div className="w-10 h-10 rounded-full bg-german-red flex items-center justify-center text-white font-bold">
                            {player.number}
                          </div>
                        </div>
                        
                        <div className="w-56 h-56 flex items-center justify-center">
                          {player.photo_url ? (
                            <img 
                              src={player.photo_url}
                              alt={player.name}
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <div className="w-full h-full bg-german-red flex items-center justify-center text-white text-2xl">
                              {player.name.split(' ').map(n => n[0]).join('')}
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col items-center">
                          {player.heritage === "German" ? (
                            <img 
                              src="/lovable-uploads/8765443e-9005-4411-b6f9-6cf0bbf78182.png"
                              alt={t("german_flag")}
                              className="w-8 h-5 object-cover rounded"
                            />
                          ) : player.heritage === "British" ? (
                            <img 
                              src="/lovable-uploads/a18e25c3-ea1c-4820-a9a0-900357680eeb.png"
                              alt={t("british_flag")}
                              className="w-8 h-5 object-cover rounded"
                            />
                          ) : (
                            <img 
                              src="https://upload.wikimedia.org/wikipedia/commons/f/f3/Flag_of_Switzerland.svg"
                              alt={t("swiss_flag")}
                              className="w-8 h-5 object-cover rounded"
                            />
                          )}
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-1">{player.name}</h3>
                      {player.position && (
                        <p className="text-german-red font-semibold">{player.position}</p>
                      )}
                    </CardHeader>
                    <CardContent className="text-center">
                      <div className="space-y-2">
                        {player.club && (
                          <p className="text-sm text-gray-300">
                            <span className="text-german-gold font-semibold">{t("club")}:</span> {player.club}
                          </p>
                        )}
                        {player.bio && (
                          <p className="text-sm text-german-gold font-semibold">
                            {player.bio.replace("Role: ", "")}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Exiles9s;
