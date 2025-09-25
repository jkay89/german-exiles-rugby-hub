
import { motion } from "framer-motion";
import { NextFixtureCard } from "./NextFixtureCard";
import { LatestResultCard } from "./LatestResultCard";
import { useInView } from "framer-motion";
import { useRef } from "react";

const FeatureGrid = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const cardVariants = {
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

  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="grid grid-cols-8 grid-rows-8 h-full">
          {[...Array(64)].map((_, i) => (
            <motion.div
              key={i}
              className="border border-german-gold"
              animate={{ opacity: [0, 0.3, 0] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: Math.random() * 4,
              }}
            />
          ))}
        </div>
      </div>

      <div ref={ref} className="container mx-auto px-6 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto"
        >
          <motion.div variants={cardVariants} className="card-interactive">
            <NextFixtureCard />
          </motion.div>
          <motion.div variants={cardVariants} className="card-interactive">
            <LatestResultCard />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeatureGrid;
