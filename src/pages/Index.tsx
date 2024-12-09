import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Trophy, Users } from "lucide-react";

const Index = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="pt-16 min-h-screen bg-black">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 0.5 }}
        className="relative h-[60vh] bg-black"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent z-10" />
        <div className="absolute inset-0">
          <img
            src="/lovable-uploads/d5497b13-60f3-4490-9abb-bc42b3027140.png"
            alt="German Exiles Rugby League"
            className="w-full h-full object-contain opacity-20"
          />
        </div>
        <div className="relative z-20 h-full flex items-center">
          <div className="container mx-auto px-6">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              German Exiles <span className="text-german-gold">Rugby League</span>
            </h1>
            <p className="text-xl text-gray-200 max-w-2xl">
              Bridging German talent worldwide through Rugby League excellence
            </p>
          </div>
        </div>
      </motion.section>

      {/* Mission Statement */}
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

      {/* Features Grid */}
      <section className="py-16 bg-gradient-to-b from-gray-900 to-black">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-black border border-german-red rounded-lg p-6 hover:border-german-gold transition-colors duration-300"
            >
              <Calendar className="h-12 w-12 text-german-red mb-4" />
              <h3 className="text-xl font-bold mb-2 text-white">Next Fixture</h3>
              <p className="text-gray-300">Coming Soon</p>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-black border border-german-red rounded-lg p-6 hover:border-german-gold transition-colors duration-300"
            >
              <Trophy className="h-12 w-12 text-german-gold mb-4" />
              <h3 className="text-xl font-bold mb-2 text-white">Latest Result</h3>
              <p className="text-gray-300">Coming Soon</p>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="bg-black border border-german-red rounded-lg p-6 hover:border-german-gold transition-colors duration-300"
            >
              <Users className="h-12 w-12 text-white mb-4" />
              <h3 className="text-xl font-bold mb-2 text-white">Join Us</h3>
              <p className="text-gray-300">Become part of our growing team</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Sponsors Banner */}
      <section className="py-16 bg-black relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 opacity-5">
          <img 
            src="/lovable-uploads/d5497b13-60f3-4490-9abb-bc42b3027140.png" 
            alt="German Exiles Logo"
            className="w-full h-full object-contain"
          />
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <h2 className="text-3xl font-bold text-center mb-12 text-german-gold">Our Sponsors</h2>
          <div className="flex flex-wrap justify-center items-center gap-8">
            <div className="w-32 h-32 bg-gray-900 rounded-lg flex items-center justify-center border border-german-red hover:border-german-gold transition-colors duration-300">
              <span className="text-gray-400">Sponsor 1</span>
            </div>
            <div className="w-32 h-32 bg-gray-900 rounded-lg flex items-center justify-center border border-german-red hover:border-german-gold transition-colors duration-300">
              <span className="text-gray-400">Sponsor 2</span>
            </div>
            <div className="w-32 h-32 bg-gray-900 rounded-lg flex items-center justify-center border border-german-red hover:border-german-gold transition-colors duration-300">
              <span className="text-gray-400">Sponsor 3</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;