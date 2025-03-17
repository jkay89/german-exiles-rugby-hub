
import { motion } from "framer-motion";
import { Trophy, Users, Globe, Handshake } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const AboutUs = () => {
  const { t } = useLanguage();
  
  const missions = [
    {
      icon: <Trophy className="h-12 w-12 text-german-gold" />,
      title: t("competitive_pathway"),
      description: t("competitive_pathway_text")
    },
    {
      icon: <Globe className="h-12 w-12 text-german-red" />,
      title: t("bundesleague_development"),
      description: t("bundesleague_development_text")
    },
    {
      icon: <Handshake className="h-12 w-12 text-german-gold" />,
      title: t("networking_opportunities"),
      description: t("networking_opportunities_text")
    },
    {
      icon: <Users className="h-12 w-12 text-german-red" />,
      title: t("skill_development"),
      description: t("skill_development_text")
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
            {t("about_title")}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-3xl mx-auto mb-16 text-center"
          >
            <p className="text-gray-300 text-lg leading-relaxed">
              {t("about_description")}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {missions.map((mission, index) => (
              <motion.div
                key={index}
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
