import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Trophy, Users } from "lucide-react";

const Index = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="pt-16 min-h-screen bg-white">
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
            src="/placeholder.svg"
            alt="German Exiles Rugby League"
            className="w-full h-full object-cover opacity-50"
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
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-3xl font-bold mb-8">Our Mission</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              German Exiles Rugby League serves as a pathway for German-eligible players 
              based in the UK to represent their heritage. We're committed to growing 
              Rugby League in Germany while providing opportunities for players to 
              compete at an international level.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-white p-6 rounded-lg shadow-lg"
            >
              <Calendar className="h-12 w-12 text-german-red mb-4" />
              <h3 className="text-xl font-bold mb-2">Next Fixture</h3>
              <p className="text-gray-600">Coming Soon</p>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-white p-6 rounded-lg shadow-lg"
            >
              <Trophy className="h-12 w-12 text-german-gold mb-4" />
              <h3 className="text-xl font-bold mb-2">Latest Result</h3>
              <p className="text-gray-600">Coming Soon</p>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="bg-white p-6 rounded-lg shadow-lg"
            >
              <Users className="h-12 w-12 text-black mb-4" />
              <h3 className="text-xl font-bold mb-2">Join Us</h3>
              <p className="text-gray-600">Become part of our growing team</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Sponsors Banner */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Our Sponsors</h2>
          <div className="flex flex-wrap justify-center items-center gap-8">
            {/* Placeholder for sponsor logos */}
            <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-gray-400">Sponsor 1</span>
            </div>
            <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-gray-400">Sponsor 2</span>
            </div>
            <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-gray-400">Sponsor 3</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;