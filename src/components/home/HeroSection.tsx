
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
              className="text-5xl md:text-7xl font-bold text-white mb-4 leading-normal"
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
              className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-white shadow-lg hover-glow"
              whileHover={{ scale: 1.2, y: -3 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.987 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.648.029 12.017.029zM18.68 14.684c-.024 1.225-.118 1.865-.196 2.3-.097.54-.216.931-.407 1.264-.295.51-.693.908-1.204 1.204-.333.191-.724.31-1.264.407-.435.078-1.075.172-2.3.196-1.33.061-1.729.073-5.058.073-3.33 0-3.728-.012-5.058-.073-1.225-.024-1.865-.118-2.3-.196-.54-.097-.931-.216-1.264-.407a3.252 3.252 0 01-1.204-1.204c-.191-.333-.31-.724-.407-1.264-.078-.435-.172-1.075-.196-2.3-.061-1.33-.073-1.729-.073-5.058 0-3.33.012-3.728.073-5.058.024-1.225.118-1.865.196-2.3.097-.54.216-.931.407-1.264.295-.51.693-.908 1.204-1.204.333-.191.724-.31 1.264-.407.435-.078 1.075-.172 2.3-.196 1.33-.061 1.729-.073 5.058-.073 3.33 0 3.728.012 5.058.073 1.225.024 1.865.118 2.3.196.54.097.931.216 1.264.407.51.295.908.693 1.204 1.204.191.333.31.724.407 1.264.078.435.172 1.075.196 2.3.061 1.33.073 1.729.073 5.058 0 3.33-.012 3.728-.073 5.058zM16.688 8.295a.968.968 0 01-.688-.285.968.968 0 01-.285-.688c0-.269.108-.526.285-.688a.968.968 0 01.688-.285c.269 0 .526.108.688.285.177.162.285.419.285.688a.968.968 0 01-.285.688.968.968 0 01-.688.285zm-4.671 1.352c2.017 0 3.653 1.636 3.653 3.653s-1.636 3.653-3.653 3.653-3.653-1.636-3.653-3.653 1.636-3.653 3.653-3.653zm0 6.019c1.306 0 2.366-1.06 2.366-2.366S13.323 10.934 12.017 10.934s-2.366 1.06-2.366 2.366 1.06 2.366 2.366 2.366z"/>
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
