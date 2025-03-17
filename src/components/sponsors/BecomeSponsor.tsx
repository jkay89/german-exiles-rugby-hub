
import { motion } from "framer-motion";

const BecomeSponsor = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-gray-900 to-black relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 opacity-5">
        <img 
          src="/lovable-uploads/d5497b13-60f3-4490-9abb-bc42b3027140.png" 
          alt="German Exiles Logo"
          className="w-full h-full object-contain"
        />
      </div>
      <div className="container mx-auto px-6 relative z-10">
        <h2 className="text-3xl font-bold mb-8 text-center text-german-gold">Become a Sponsor</h2>
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-gray-300 mb-8">
            Join us in supporting the development of Rugby League in Germany. 
            Contact us to learn more about our sponsorship opportunities.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-german-red text-white px-8 py-3 rounded-lg font-bold hover:bg-red-700 transition-colors"
          >
            Contact for Sponsorship
          </motion.button>
        </div>
      </div>
    </section>
  );
};

export default BecomeSponsor;
