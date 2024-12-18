import { motion } from "framer-motion";
import { Flag, Trophy, Users, ArrowUp, Calendar } from "lucide-react";

const NRLD = () => {
  const sections = [
    {
      icon: <Flag className="h-12 w-12 text-german-gold" />,
      title: "National Rugby League Deutschland",
      content: "The NRLD is the governing body for Rugby League in Germany, dedicated to growing and developing the sport across the country. Working alongside international partners, we aim to establish Rugby League as a prominent sport in German sporting culture."
    },
    {
      icon: <Trophy className="h-12 w-12 text-german-red" />,
      title: "Competitions",
      content: "We organize and oversee various competitions including the German Rugby League Bundesliga, international fixtures, and youth development tournaments. These competitions provide crucial playing opportunities for athletes at all levels."
    },
    {
      icon: <Users className="h-12 w-12 text-german-gold" />,
      title: "Development Programs",
      content: "Our development programs focus on player pathways, coach education, and referee development. We work closely with clubs and regions to ensure sustainable growth of the sport."
    },
    {
      icon: <ArrowUp className="h-12 w-12 text-german-red" />,
      title: "Future Vision",
      content: "The NRLD is committed to establishing Germany as a competitive nation in international Rugby League, with aims to participate in major tournaments and develop a strong domestic competition structure."
    }
  ];

  const upcomingFixtures = [
    {
      date: "May 15, 2024",
      event: "Bundesleague Round 1",
      teams: "Berlin vs Hamburg",
      location: "Berlin Sportpark"
    },
    {
      date: "June 1, 2024",
      event: "International Friendly",
      teams: "Germany vs Netherlands",
      location: "Cologne Stadium"
    },
    {
      date: "June 15, 2024",
      event: "Bundesleague Round 2",
      teams: "Munich vs Frankfurt",
      location: "Munich Arena"
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
        
        <div className="relative z-10 container mx-auto px-6 py-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-german-gold text-center mb-12"
          >
            National Rugby League Deutschland
          </motion.h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-16">
            {sections.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="bg-gray-900 border border-german-red hover:border-german-gold transition-colors duration-300 rounded-lg p-6"
              >
                <div className="flex items-center mb-4">
                  {section.icon}
                  <h3 className="text-xl font-bold text-white ml-4">{section.title}</h3>
                </div>
                <p className="text-gray-300">{section.content}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="max-w-6xl mx-auto"
          >
            <div className="bg-gray-900 border border-german-red rounded-lg p-6">
              <div className="flex items-center mb-6">
                <Calendar className="h-8 w-8 text-german-gold mr-4" />
                <h2 className="text-2xl font-bold text-white">Upcoming Fixtures</h2>
              </div>
              <div className="space-y-4">
                {upcomingFixtures.map((fixture, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1 + (index * 0.2) }}
                    className="border-l-4 border-german-gold p-4 bg-gray-800 rounded-r-lg hover:bg-gray-700 transition-colors duration-300"
                  >
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                      <div>
                        <h3 className="text-white font-bold">{fixture.event}</h3>
                        <p className="text-german-red">{fixture.teams}</p>
                      </div>
                      <div className="mt-2 md:mt-0 text-right">
                        <p className="text-gray-300">{fixture.date}</p>
                        <p className="text-gray-400 text-sm">{fixture.location}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default NRLD;