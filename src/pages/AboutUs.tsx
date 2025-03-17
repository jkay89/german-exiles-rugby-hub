
import { motion } from "framer-motion";
import { Trophy, Users, Globe, Handshake } from "lucide-react";

const AboutUs = () => {
  const missions = [
    {
      icon: <Trophy className="h-12 w-12 text-german-gold" />,
      title: "Competitive Pathway",
      description: "Providing opportunities for eligible non-professional heritage players & upcoming youth players (16+) to enter the German RL national setup"
    },
    {
      icon: <Globe className="h-12 w-12 text-german-red" />,
      title: "Bundesleague Development",
      description: "Supporting and strengthening the German Bundesleague setup through collaboration and resource sharing"
    },
    {
      icon: <Handshake className="h-12 w-12 text-german-gold" />,
      title: "Networking Opportunities",
      description: "Creating connections for eligible non-professional heritage players into semi & professional setups"
    },
    {
      icon: <Users className="h-12 w-12 text-german-red" />,
      title: "Skill Development",
      description: "Developing basic RL skills while fostering connections across Europe to promote rugby league and our sponsors' interests"
    }
  ];

  return (
    <div className="pt-16 min-h-screen bg-black">
      <div className="relative">
        <div className="absolute inset-0 opacity-5">
          <img
            src="/lovable-uploads/d5497b13-60f3-4490-9abb-bc42b3027140.png"
            alt="Background Logo"
            className="w-full h-full object-contain"
          />
        </div>
        
        <div className="relative z-10 container mx-auto px-6 py-16 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-german-gold text-center mb-8"
          >
            About German Exiles RL
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-3xl mx-auto mb-16 text-center"
          >
            <p className="text-gray-300 text-lg leading-relaxed">
              The German Exiles Rugby League serves as a vital bridge between heritage players and the German national rugby league system. Our mission is to identify, develop, and nurture talent while strengthening the foundations of rugby league in Germany. Through our comprehensive approach to player development, networking, and community building, we aim to contribute significantly to the growth and success of German Rugby League on both domestic and international stages.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {missions.map((mission, index) => (
              <motion.div
                key={mission.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="bg-gray-900 border border-german-red hover:border-german-gold transition-colors duration-300 rounded-lg p-6 flex flex-col items-center text-center"
              >
                <div className="mb-4">
                  {mission.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{mission.title}</h3>
                <p className="text-gray-300">{mission.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
