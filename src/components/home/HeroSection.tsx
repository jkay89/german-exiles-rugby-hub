
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
      className="relative h-[70vh] bg-gradient-to-br from-black via-gray-900 to-black overflow-visible"
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
            className="mb-6 overflow-visible"
          >
            <motion.h1 
              className="text-5xl md:text-7xl font-bold text-white mb-6 leading-relaxed pb-2"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <span className="text-gradient inline-block">{t("hero_title")}</span>
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

          <motion.div
            variants={itemVariants}
            className="flex justify-center gap-4 mt-6"
          >
            <motion.a 
              href="https://www.facebook.com/p/German-Exiles-Rugby-League-61569070281435/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-blue-600 rounded-full text-white shadow-lg hover-glow"
              whileHover={{ scale: 1.2, y: -3 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </motion.a>
            <motion.a 
              href="https://www.instagram.com/germanexilesrl/?hl=en"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-pink-600 rounded-full text-white shadow-lg hover-glow"
              whileHover={{ scale: 1.2, y: -3 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </motion.a>
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
