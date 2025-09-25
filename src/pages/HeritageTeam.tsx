
import { motion } from "framer-motion";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect, useState } from "react";
import { fetchPlayersByTeam, Player } from "@/utils/playerUtils";
import { Loader2, Star, Trophy, MapPin, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useInView } from "framer-motion";
import { useRef } from "react";

const HeritageTeam = () => {
  const { t } = useLanguage();
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  
  useEffect(() => {
    const loadPlayers = async () => {
      setLoading(true);
      try {
        const data = await fetchPlayersByTeam("heritage");
        console.log("Loaded heritage team players:", data);
        setPlayers(data);
      } catch (error) {
        console.error("Error loading heritage team players:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadPlayers();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { y: 50, opacity: 0, rotateX: -15 },
    visible: {
      y: 0,
      opacity: 1,
      rotateX: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  const headerVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 20,
      },
    },
  };

  return (
    <div className="pt-16 min-h-screen bg-gradient-to-br from-black via-gray-900 to-black overflow-hidden">
      <motion.section
        initial="hidden"
        animate="visible"
        variants={headerVariants}
        className="relative py-20 text-white overflow-hidden"
      >
        {/* Animated background elements */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            className="absolute top-10 right-10 w-32 h-32 opacity-10"
          >
            <img 
              src="/lovable-uploads/d5497b13-60f3-4490-9abb-bc42b3027140.png" 
              alt="German Exiles Logo"
              className="w-full h-full object-contain"
            />
          </motion.div>
          
          {/* Floating stars */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [-10, 10, -10],
                opacity: [0.3, 1, 0.3],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            >
              <Star className="w-6 h-6 text-german-gold" />
            </motion.div>
          ))}
        </div>

        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.h1 
            className="text-5xl md:text-7xl font-bold mb-6"
            whileHover={{ scale: 1.02 }}
          >
            <span className="text-gradient">{t("heritage_team_title")}</span>
          </motion.h1>
          
          <motion.div
            className="w-40 h-1 bg-gradient-to-r from-german-red via-german-gold to-german-red mx-auto rounded-full mb-8"
            initial={{ width: 0 }}
            animate={{ width: "10rem" }}
            transition={{ duration: 1.5, delay: 0.5 }}
          />
          
          <motion.p 
            className="text-gray-300 max-w-3xl mx-auto text-lg md:text-xl leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {t("heritage_team_description")}
          </motion.p>

          {/* Team stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex justify-center gap-8 mt-12"
          >
            <div className="text-center">
              <div className="text-3xl font-bold text-german-gold mb-1">{players.length}</div>
              <div className="text-sm text-gray-400">Players</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-german-red mb-1">🇩🇪</div>
              <div className="text-sm text-gray-400">Heritage</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-german-gold mb-1"><Trophy className="w-8 h-8 mx-auto" /></div>
              <div className="text-sm text-gray-400">Elite</div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      <section ref={ref} className="py-20 bg-gradient-to-b from-transparent to-gray-900/50">
        <div className="container mx-auto px-6">
          {loading ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center py-20"
            >
              <Loader2 className="h-12 w-12 text-german-gold animate-spin mb-4" />
              <p className="text-gray-400 animate-pulse">Loading our champions...</p>
            </motion.div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            >
              {players.map((player, index) => (
                <motion.div
                  key={player.id}
                  variants={cardVariants}
                  whileHover={{ 
                    scale: 1.05, 
                    rotateY: 5,
                    boxShadow: "0 20px 40px rgba(255, 215, 0, 0.2)"
                  }}
                  className="group perspective-1000"
                  style={{ 
                    "--stagger": index 
                  } as React.CSSProperties}
                >
                  <Card className="bg-gradient-to-br from-black/90 to-gray-900/90 border-german-red/50 hover:border-german-gold transition-all duration-500 backdrop-blur-sm overflow-hidden relative">
                    {/* Shimmer effect */}
                    <div className="absolute inset-0 shimmer-effect pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <CardHeader className="flex flex-col items-center relative z-10">
                      <div className="w-full flex justify-between items-start mb-6">
                        <motion.div 
                          className="text-center"
                          whileHover={{ scale: 1.1 }}
                        >
                          <div className="w-12 h-12 bg-german-red rounded-full flex items-center justify-center mb-2 group-hover:animate-pulse">
                            <span className="text-white font-bold text-lg">#{String(player.number || '00').padStart(2, '0')}</span>
                          </div>
                        </motion.div>
                        
                        <motion.div 
                          className="w-28 h-28 flex items-center justify-center"
                          whileHover={{ scale: 1.1, rotate: 5 }}
                        >
                          <Avatar className="w-28 h-28 border-4 border-german-gold/50 group-hover:border-german-gold transition-all duration-300">
                            {player.photo_url ? (
                              <AvatarImage 
                                src={player.photo_url}
                                alt={player.name}
                                className="object-cover"
                              />
                            ) : (
                              <AvatarFallback className="bg-gradient-to-br from-german-red to-german-gold text-white text-2xl font-bold">
                                {player.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            )}
                          </Avatar>
                        </motion.div>
                        
                        <motion.div 
                          className="text-center"
                          whileHover={{ scale: 1.2 }}
                        >
                          <div className="mb-2">
                            {player.heritage === "DE" ? (
                              <img 
                                src="/lovable-uploads/8765443e-9005-4411-b6f9-6cf0bbf78182.png"
                                alt="German Flag"
                                className="w-10 h-6 object-cover rounded shadow-md"
                              />
                            ) : (
                              <img 
                                src="/lovable-uploads/a18e25c3-ea1c-4820-a9a0-900357680eeb.png"
                                alt="British Flag"
                                className="w-10 h-6 object-cover rounded shadow-md"
                              />
                            )}
                          </div>
                          {player.national_number && (
                            <span className="text-xs text-german-gold font-semibold bg-black/50 px-2 py-1 rounded">
                              {player.national_number}
                            </span>
                          )}
                        </motion.div>
                      </div>
                      
                      <motion.h3 
                        className="text-xl font-bold text-white mb-2 text-center group-hover:text-german-gold transition-colors"
                        whileHover={{ scale: 1.05 }}
                      >
                        {player.name}
                      </motion.h3>
                      <p className="text-german-red font-semibold text-center bg-black/30 px-3 py-1 rounded-full">
                        {player.position}
                      </p>
                    </CardHeader>
                    
                    <CardContent className="text-center space-y-3 relative z-10">
                      <motion.div 
                        className="flex items-center justify-center text-sm text-german-gold bg-black/30 rounded-full px-3 py-2"
                        whileHover={{ scale: 1.05 }}
                      >
                        <MapPin className="w-4 h-4 mr-2" />
                        <span>{t("club")}: {player.club || t("unaffiliated")}</span>
                      </motion.div>
                      
                      {player.bio && (
                        <motion.p 
                          className="text-sm text-gray-300 bg-black/20 p-3 rounded-lg"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          transition={{ delay: 0.2 }}
                        >
                          {player.bio}
                        </motion.p>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
};

export default HeritageTeam;
