import { motion } from "framer-motion";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

interface PlayerProfile {
  teamNumber: string;
  name: string;
  position: string;
  countryHeritage: "DE" | "GB";
  nationalTeamNumber?: string;
  image?: string;
}

const CommunityTeam = () => {
  const players: PlayerProfile[] = [];

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
        <div className="container mx-auto px-6 relative z-10">
          <h1 className="text-4xl font-bold mb-4 text-german-gold">Community Team</h1>
          <p className="text-gray-300 max-w-2xl mx-auto mb-12">
            Our community team represents the growing rugby league community in Germany. 
            This page will be updated with player profiles soon.
          </p>
        </div>
      </motion.section>

      <section className="py-16 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {players.map((player, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-black border-german-red hover:border-german-gold transition-colors duration-300">
                  <CardHeader className="flex flex-col items-center">
                    <div className="flex items-center justify-center w-full mb-4 space-x-8">
                      <div className="flex flex-col items-center">
                        <img 
                          src="/lovable-uploads/d5497b13-60f3-4490-9abb-bc42b3027140.png"
                          alt="German Exiles Logo"
                          className="w-8 h-8 object-contain"
                        />
                        <span className="text-sm mt-2 text-gray-300">{player.teamNumber}</span>
                      </div>
                      
                      <Avatar className="w-24 h-24">
                        <AvatarImage src={player.image} alt={player.name} />
                        <AvatarFallback className="bg-german-red text-white text-2xl">
                          {player.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex flex-col items-center">
                        {player.countryHeritage === "DE" ? (
                          <img 
                            src="/lovable-uploads/8765443e-9005-4411-b6f9-6cf0bbf78182.png"
                            alt="German Flag"
                            className="w-8 h-5 object-cover rounded"
                          />
                        ) : (
                          <img 
                            src="/lovable-uploads/a18e25c3-ea1c-4820-a9a0-900357680eeb.png"
                            alt="British Flag"
                            className="w-8 h-5 object-cover rounded"
                          />
                        )}
                        <span className="text-sm mt-2 text-gray-300">
                          {player.nationalTeamNumber || "N/A"}
                        </span>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-1">{player.name}</h3>
                    <p className="text-german-red font-semibold">{player.position}</p>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-sm text-german-gold">
                      Heritage: {player.countryHeritage === "DE" ? "German" : "British"}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default CommunityTeam;