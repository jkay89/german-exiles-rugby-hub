import { motion, useInView } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useRef, useState } from "react";
import { fetchPlayersByTeam, Player } from "@/utils/playerUtils";
import { Loader2, Trophy } from "lucide-react";
import { PlayerSponsorsDisplay } from "@/components/player/PlayerSponsorsDisplay";
import { PageWithPositionedElements } from "@/components/PageWithPositionedElements";

const TheTeam = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedBios, setExpandedBios] = useState<Record<string, boolean>>({});
  const ref = useRef(null);
  useInView(ref, { once: true, amount: 0.1 });

  useEffect(() => {
    const loadPlayers = async () => {
      setLoading(true);
      try {
        const [heritage, community] = await Promise.all([
          fetchPlayersByTeam("heritage"),
          fetchPlayersByTeam("community"),
        ]);
        // Merge and de-duplicate by id, then sort by number then name
        const map = new Map<string, Player>();
        [...heritage, ...community].forEach((p) => map.set(p.id, p));
        const merged = Array.from(map.values()).sort((a, b) => {
          const an = a.number ?? 9999;
          const bn = b.number ?? 9999;
          if (an !== bn) return an - bn;
          return a.name.localeCompare(b.name);
        });
        setPlayers(merged);
      } catch (error) {
        console.error("Error loading team players:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPlayers();
  }, []);

  const toggleBio = (playerId: string) => {
    setExpandedBios((prev) => ({ ...prev, [playerId]: !prev[playerId] }));
  };

  const truncateBio = (bio: string, playerId: string) => {
    const lines = bio.split("\n");
    const isExpanded = expandedBios[playerId];
    if (isExpanded || lines.length <= 2) return bio;
    return lines.slice(0, 2).join("\n");
  };

  const headerVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 120, damping: 20 },
    },
  };

  return (
    <PageWithPositionedElements
      page="the-team"
      className="pt-16 min-h-screen bg-gradient-to-br from-black via-gray-900 to-black overflow-hidden"
    >
      <motion.section
        initial="hidden"
        animate="visible"
        variants={headerVariants}
        className="relative py-20 text-white overflow-hidden"
      >
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
        </div>

        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.h1 className="text-5xl md:text-7xl font-bold mb-6" whileHover={{ scale: 1.02 }}>
            <span className="text-gradient">The Team</span>
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
            Meet the players representing German Exiles Rugby League.
          </motion.p>

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
              <div className="text-3xl font-bold text-german-gold mb-1">
                <Trophy className="w-8 h-8 mx-auto" />
              </div>
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
          ) : players.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-white text-xl">No players found</p>
              <p className="text-gray-400 mt-2">Please check back later</p>
            </div>
          ) : (
            <div className="text-white">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {players.map((player) => (
                  <Card key={player.id} className="bg-gray-800 border-german-gold overflow-hidden flex flex-col hover:shadow-lg hover:shadow-german-gold/20 transition-shadow">
                    {player.photo_url ? (
                      <div className="w-full aspect-square bg-gray-900 overflow-hidden">
                        <img
                          src={player.photo_url}
                          alt={player.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-full aspect-square bg-gray-900 flex items-center justify-center text-gray-600 text-6xl font-bold">
                        {player.name?.charAt(0)}
                      </div>
                    )}
                    <CardContent className="p-5 flex-1 flex flex-col">
                      <h3 className="text-german-gold font-bold text-lg mb-1">
                        #{player.number} {player.name}
                      </h3>
                      <p className="text-gray-300 text-sm">{player.position}</p>
                      <p className="text-gray-400 text-sm">{player.club}</p>
                      <p className="text-gray-400 text-sm mb-3">Heritage: {player.heritage}</p>

                      {player.bio && (
                        <div className="border-t border-gray-700 pt-3 mb-3">
                          <p className="text-gray-300 text-sm whitespace-pre-line">
                            {truncateBio(player.bio, player.id)}
                          </p>
                          {player.bio.split("\n").length > 2 && (
                            <button
                              onClick={() => toggleBio(player.id)}
                              className="text-german-gold text-sm mt-2 hover:underline"
                            >
                              {expandedBios[player.id] ? "...See Less" : "...See More"}
                            </button>
                          )}
                        </div>
                      )}

                      <PlayerSponsorsDisplay playerId={player.id} />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </PageWithPositionedElements>
  );
};

export default TheTeam;
