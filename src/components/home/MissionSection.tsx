
import { motion } from "framer-motion";

const MissionSection = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-black to-gray-900">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-3xl font-bold mb-8 text-german-gold">Our Mission</h2>
          <p className="text-lg text-gray-300 leading-relaxed">
            German Exiles Rugby League serves as a pathway for German-eligible players 
            based in the UK to represent their heritage. We're committed to growing 
            Rugby League in Germany while providing opportunities for players to 
            compete at an international level.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default MissionSection;
