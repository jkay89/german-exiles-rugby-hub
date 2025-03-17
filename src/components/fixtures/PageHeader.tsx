
import { motion } from "framer-motion";

const PageHeader = () => {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative py-16 bg-black text-white overflow-hidden"
    >
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-48 h-48 md:w-64 md:h-64 opacity-10">
        <img 
          src="/lovable-uploads/d5497b13-60f3-4490-9abb-bc42b3027140.png" 
          alt="German Exiles Logo"
          className="w-full h-full object-contain"
        />
      </div>
      <div className="container mx-auto px-6 relative z-10">
        <h1 className="text-4xl font-bold mb-4 text-german-gold">Fixtures & Results</h1>
        <p className="text-gray-300">View our upcoming games, past results, and player statistics</p>
      </div>
    </motion.section>
  );
};

export default PageHeader;
