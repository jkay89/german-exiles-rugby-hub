
import { useEffect, useState } from 'react';
import { motion } from "framer-motion";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { PlayerSponsorsDisplay } from "@/components/player/PlayerSponsorsDisplay";

interface PlayerProfile {
  id: string;
  teamNumber: string;
  name: string;
  position: string;
  countryHeritage: "DE" | "GB";
  nationalTeamNumber?: string;
  image?: string;
  club?: string;
  bio?: string;
}

const CommunityTeam = () => {
  const { t } = useLanguage();
  const [players, setPlayers] = useState<PlayerProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedBios, setExpandedBios] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const loadCommunityPlayers = async () => {
      try {
        const { data, error } = await supabase
          .from('players')
          .select('*')
          .eq('team', 'community')
          .order('number', { ascending: true });

        if (error) throw error;

        const transformedPlayers: PlayerProfile[] = (data || []).map(player => ({
          id: player.id,
          teamNumber: player.number?.toString() || '',
          name: player.name,
          position: player.position || '',
          countryHeritage: player.heritage === 'DE' ? 'DE' : 'GB',
          nationalTeamNumber: player.national_number || undefined,
          image: player.photo_url || undefined,
          club: player.club || undefined,
          bio: player.bio || undefined,
        }));

        setPlayers(transformedPlayers);
      } catch (error) {
        console.error('Error loading community team players:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCommunityPlayers();

    // Set up real-time subscription to refresh when players are added/updated
    const subscription = supabase
      .channel('community-players')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'players', filter: 'team=eq.community' }, 
        () => {
          console.log('Community team player data changed, reloading...');
          loadCommunityPlayers();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const toggleBio = (playerId: string) => {
    setExpandedBios(prev => ({
      ...prev,
      [playerId]: !prev[playerId]
    }));
  };

  const truncateBio = (bio: string, playerId: string) => {
    const lines = bio.split('\n');
    const isExpanded = expandedBios[playerId];
    
    if (isExpanded || lines.length <= 2) {
      return bio;
    }
    
    return lines.slice(0, 2).join('\n');
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
            alt="German Exiles Logo"
            className="w-full h-full object-contain"
          />
        </div>
        <div className="container mx-auto px-6 relative z-10 text-center">
          <h1 className="text-4xl font-bold mb-4 text-german-gold">{t("community_team_title")}</h1>
          <p className="text-gray-300 max-w-2xl mx-auto mb-12">
            {t("community_team_description")}
          </p>
        </div>
      </motion.section>

      <section className="py-16 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-6">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="text-white">Loading community players...</div>
            </div>
          ) : players.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-white text-xl">No community players found</p>
              <p className="text-gray-400 mt-2">Please check back later</p>
            </div>
          ) : (
            <div className="text-white">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {players.map((player, index) => (
                  <Card key={player.id} className="bg-gray-800 border-german-gold">
                    <CardContent className="p-6">
                      <div className="flex gap-4 mb-4">
                        <div className="flex-1">
                          <h3 className="text-german-gold font-bold text-lg mb-2">
                            #{player.teamNumber} {player.name}
                          </h3>
                          <p className="text-gray-300 mb-1">{player.position}</p>
                          <p className="text-gray-400 text-sm">{player.club}</p>
                          <p className="text-gray-400 text-sm">Heritage: {player.countryHeritage === "DE" ? "German" : "British"}</p>
                        </div>
                        {player.image && (
                          <div className="w-24 h-24 flex-shrink-0">
                            <img src={player.image} alt={player.name} className="w-full h-full object-cover rounded" />
                          </div>
                        )}
                      </div>
                      
                      {player.bio && (
                        <div className="border-t border-gray-700 pt-3 mb-3">
                          <p className="text-gray-300 text-sm whitespace-pre-line">
                            {truncateBio(player.bio, player.id)}
                          </p>
                          {player.bio.split('\n').length > 2 && (
                            <button
                              onClick={() => toggleBio(player.id)}
                              className="text-german-gold text-sm mt-2 hover:underline"
                            >
                              {expandedBios[player.id] ? '...See Less' : '...See More'}
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
    </div>
  );
};

export default CommunityTeam;
