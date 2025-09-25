
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { Sparkles, Star, Trophy } from "lucide-react";

interface HeroSectionProps {
  isLoaded: boolean;
}

const HeroSection = ({ isLoaded }: HeroSectionProps) => {
  const { t } = useLanguage();
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  };

  const floatingVariants = {
    float: {
      y: [-10, 10, -10],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };
  
  return (
    <motion.section
      initial="hidden"
      animate={isLoaded ? "visible" : "hidden"}
      variants={containerVariants}
      className="relative h-[70vh] bg-gradient-to-br from-black via-gray-900 to-black overflow-hidden"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-10 right-10 w-20 h-20 opacity-10"
        >
          <Trophy className="w-full h-full text-german-gold" />
        </motion.div>
        <motion.div
          animate={floatingVariants.float}
          className="absolute top-20 left-20 w-8 h-8 opacity-20"
        >
          <Star className="w-full h-full text-german-red animate-pulse" />
        </motion.div>
        <motion.div
          animate={{ ...floatingVariants.float, transition: { ...floatingVariants.float.transition, delay: 1 } }}
          className="absolute bottom-20 right-20 w-12 h-12 opacity-15"
        >
          <Sparkles className="w-full h-full text-german-gold animate-glow" />
        </motion.div>
      </div>

      <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent z-10" />
      
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.3 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute inset-0"
      >
        <img
          src="/lovable-uploads/d5497b13-60f3-4490-9abb-bc42b3027140.png"
          alt="German Exiles Rugby League"
          className="w-full h-full object-contain animate-float"
        />
      </motion.div>

      <div className="relative z-20 h-full flex items-center">
        <motion.div 
          variants={containerVariants}
          className="container mx-auto px-6 text-center"
        >
          <motion.div
            variants={itemVariants}
            className="mb-6"
          >
            <motion.h1 
              className="text-5xl md:text-7xl font-bold text-white mb-4 leading-tight"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <span className="text-gradient animate-shimmer inline-block">{t("hero_title")}</span>
            </motion.h1>
          </motion.div>
          
          <motion.div
            variants={itemVariants}
            className="mb-8"
          >
            <p className="text-xl md:text-2xl text-gray-200 mx-auto max-w-3xl leading-relaxed">
              {t("hero_subtitle")}
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="flex flex-wrap justify-center gap-4"
          >
            <motion.div 
              className="px-6 py-3 bg-german-red rounded-full text-white font-semibold shadow-lg hover-glow cursor-pointer"
              whileHover={{ scale: 1.1, y: -5 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              Join Our Community
            </motion.div>
            <motion.div 
              className="px-6 py-3 border-2 border-german-gold text-german-gold rounded-full font-semibold hover:bg-german-gold hover:text-black transition-all duration-300 cursor-pointer"
              whileHover={{ scale: 1.1, y: -5 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              Learn More
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Animated particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-german-gold rounded-full opacity-60"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              opacity: [0.6, 1, 0.6],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    </motion.section>
  );
};

export default HeroSection;
