
import { motion } from "framer-motion";
import { Trophy, Users, Globe, Handshake, Target, Heart } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useInView } from "framer-motion";
import { useRef } from "react";

const AboutUs = () => {
  const { t } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  
  const missions = [
    {
      icon: <Trophy className="h-12 w-12 text-german-gold" />,
      title: t("competitive_pathway"),
      description: t("competitive_pathway_text"),
      gradient: "from-german-gold/20 to-yellow-500/20"
    },
    {
      icon: <Globe className="h-12 w-12 text-german-red" />,
      title: t("bundesleague_development"),
      description: t("bundesleague_development_text"),
      gradient: "from-german-red/20 to-red-500/20"
    },
    {
      icon: <Handshake className="h-12 w-12 text-german-gold" />,
      title: t("networking_opportunities"),
      description: t("networking_opportunities_text"),
      gradient: "from-german-gold/20 to-amber-500/20"
    },
    {
      icon: <Users className="h-12 w-12 text-german-red" />,
      title: t("skill_development"),
      description: t("skill_development_text"),
      gradient: "from-german-red/20 to-rose-500/20"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0, scale: 0.9 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  const headerVariants = {
    hidden: { y: -50, opacity: 0 },
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
    <div className="pt-16 min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
      {/* Animated background patterns */}
      <div className="absolute inset-0 opacity-5">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
          className="absolute top-20 right-20"
        >
          <img
            src="/lovable-uploads/d5497b13-60f3-4490-9abb-bc42b3027140.png"
            alt="Background Logo"
            className="w-64 h-64 object-contain"
          />
        </motion.div>
      </div>

      {/* Floating elements */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-4 h-4 bg-german-gold rounded-full opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              opacity: [0.2, 0.6, 0.2],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 4,
            }}
          />
        ))}
      </div>
        
      <div ref={ref} className="relative z-10 container mx-auto px-6 py-16">
        <motion.div
          variants={headerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-center mb-16"
        >
          <motion.h1 
            className="text-5xl md:text-6xl font-bold text-center mb-8"
            whileHover={{ scale: 1.05 }}
          >
            <span className="text-gradient">{t("about_title")}</span>
          </motion.h1>

          <motion.div
            className="w-32 h-1 bg-gradient-to-r from-german-red via-german-gold to-german-red mx-auto rounded-full mb-8"
            initial={{ width: 0, opacity: 0 }}
            animate={isInView ? { width: "8rem", opacity: 1 } : { width: 0, opacity: 0 }}
            transition={{ duration: 1.2, delay: 0.3 }}
          />

          <motion.div
            variants={itemVariants}
            className="max-w-4xl mx-auto mb-16"
          >
            <p className="text-gray-300 text-lg md:text-xl leading-relaxed">
              {t("about_description")}
            </p>
          </motion.div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto"
        >
          {missions.map((mission, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ 
                scale: 1.05,
                rotateY: 5,
                z: 50
              }}
              className={`bg-gradient-to-br ${mission.gradient} backdrop-blur-sm border border-gray-700 hover:border-german-gold transition-all duration-500 rounded-xl p-8 flex flex-col items-center text-center group card-interactive shimmer-effect`}
            >
              <motion.div 
                className="mb-6 p-4 bg-black/50 rounded-full group-hover:animate-bounce"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                {mission.icon}
              </motion.div>
              <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-german-gold transition-colors">{mission.title}</h3>
              <p className="text-gray-300 leading-relaxed">{mission.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="mt-20 text-center"
        >
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { number: "50+", label: "Players", icon: <Users className="w-6 h-6" /> },
              { number: "5+", label: "Years", icon: <Trophy className="w-6 h-6" /> },
              { number: "10+", label: "Countries", icon: <Globe className="w-6 h-6" /> }
            ].map((stat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.1 }}
                className="bg-black/50 rounded-lg p-6 border border-german-gold/30 hover:border-german-gold transition-all duration-300"
              >
                <div className="flex items-center justify-center mb-2 text-german-gold">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-german-gold mb-2">{stat.number}</div>
                <div className="text-gray-300">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutUs;
