
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Heart, Globe, Users, Trophy } from "lucide-react";

const MissionSection = () => {
  const { t } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  
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
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 12,
      },
    },
  };

  const iconVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 10,
      },
    },
  };

  const missionPoints = [
    { icon: Heart, text: "Building Community" },
    { icon: Globe, text: "Global Connection" },
    { icon: Users, text: "Team Spirit" },
    { icon: Trophy, text: "Excellence" },
  ];
  
  return (
    <section className="py-20 bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
      {/* Floating background elements */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="absolute top-10 right-10 w-32 h-32 opacity-5 text-german-gold"
      >
        <Trophy className="w-full h-full" />
      </motion.div>

      <div ref={ref} className="container mx-auto px-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="max-w-6xl mx-auto text-center"
        >
          <motion.div variants={itemVariants} className="mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gradient">
              {t("our_mission")}
            </h2>
            <motion.div
              className="w-24 h-1 bg-gradient-to-r from-german-red to-german-gold mx-auto rounded-full"
              initial={{ width: 0 }}
              animate={isInView ? { width: "6rem" } : { width: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </motion.div>

          <motion.div variants={itemVariants} className="mb-12">
            <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-4xl mx-auto">
              {t("mission_text")}
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16"
          >
            {missionPoints.map((point, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="group text-center"
                whileHover={{ scale: 1.1 }}
              >
                <motion.div
                  variants={iconVariants}
                  className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-german-red to-german-gold rounded-full flex items-center justify-center text-white group-hover:shadow-lg group-hover:shadow-german-gold/50 transition-shadow duration-300"
                >
                  <point.icon className="w-8 h-8" />
                </motion.div>
                <p className="text-sm font-semibold text-gray-300 group-hover:text-german-gold transition-colors">
                  {point.text}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default MissionSection;
