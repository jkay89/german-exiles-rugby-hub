
import { motion } from "framer-motion";

const PageHeader = () => {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative py-16 bg-gradient-to-b from-black to-gray-900 text-white overflow-hidden"
    >
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-german-red via-german-gold to-german-red"></div>
      </div>
      
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-48 h-48 md:w-64 md:h-64 opacity-10">
        <img 
          src="/lovable-uploads/d5497b13-60f3-4490-9abb-bc42b3027140.png" 
          alt="German Exiles Logo"
          className="w-full h-full object-contain"
        />
      </div>
      
      <div className="container mx-auto px-6 relative z-10 text-center">
        <motion.h1 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-4xl font-bold mb-4 text-german-gold"
        >
          Fixtures & Results
        </motion.h1>
        
        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-gray-300 max-w-2xl mx-auto"
        >
          Stay up to date with all German Exiles Rugby matches - view upcoming fixtures and check past results.
        </motion.p>
      </div>
    </motion.section>
  );
};

export default PageHeader;
