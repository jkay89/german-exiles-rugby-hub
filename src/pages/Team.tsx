import { motion } from "framer-motion";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

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
    <div className="pt-16 min-h-screen bg-white">
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="py-16 bg-black text-white"
      >
        <div className="container mx-auto px-6">
          <h1 className="text-4xl font-bold mb-4">Our Team</h1>
          <p className="text-gray-300">Meet the German Exiles Rugby League squad</p>
        </div>
      </motion.section>

      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {players.map((player, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-lg p-6"
              >
                <div className="flex flex-col items-center">
                  <Avatar className="w-32 h-32 mb-4">
                    <AvatarImage src={player.image} alt={player.name} />
                    <AvatarFallback className="bg-german-red text-white text-2xl">
                      {player.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="text-xl font-bold mb-2">{player.name}</h3>
                  <p className="text-gray-600 mb-2">{player.position}</p>
                  <p className="text-sm text-german-gold">Sponsored by {player.sponsor}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Team;