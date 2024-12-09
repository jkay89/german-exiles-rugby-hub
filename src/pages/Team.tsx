import { motion } from "framer-motion";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

interface PlayerProfile {
  name: string;
  position: string;
  sponsor: string;
  image?: string;
}

const Team = () => {
  // Placeholder data - replace with actual player data
  const players: PlayerProfile[] = [
    {
      name: "Player 1",
      position: "Prop",
      sponsor: "Sponsor A",
    },
    {
      name: "Player 2",
      position: "Hooker",
      sponsor: "Sponsor B",
    },
    // Add more players as needed
  ];

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
          <h1 className="text-4xl font-bold mb-4 text-german-gold">Our Squad</h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Meet the players representing German Exiles Rugby League. Our team consists of German-eligible players based in the UK, 
            all committed to growing the sport in Germany.
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
                    <Avatar className="w-32 h-32 mb-4">
                      <AvatarImage src={player.image} alt={player.name} />
                      <AvatarFallback className="bg-german-red text-white text-2xl">
                        {player.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="text-xl font-bold text-white mb-1">{player.name}</h3>
                    <p className="text-german-red font-semibold">{player.position}</p>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-sm text-german-gold">Sponsored by {player.sponsor}</p>
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

export default Team;