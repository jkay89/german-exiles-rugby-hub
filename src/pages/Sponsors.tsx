
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const Sponsors = () => {
  return (
    <div className="pt-16 min-h-screen bg-black">
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
          <h1 className="text-4xl font-bold mb-4 text-german-gold">Our Sponsors</h1>
          <p className="text-gray-300">Supporting the growth of German Rugby League</p>
        </div>
      </motion.section>

      <section className="py-16 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-german-gold mb-4">Main Sponsor</h2>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-black border border-german-red rounded-lg p-8 hover:border-german-gold transition-colors duration-300"
          >
            <div className="flex flex-col md:flex-row items-center gap-8">
              <a 
                href="https://www.safetechinnovations.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full md:w-1/3 hover:opacity-90 transition-opacity"
              >
                <img 
                  src="/lovable-uploads/f79f5262-9a43-411e-85bf-4800b6fc4f3e.png" 
                  alt="Safetech Innovations Logo"
                  className="w-full h-auto"
                />
              </a>
              <div className="w-full md:w-2/3">
                <h3 className="text-2xl font-bold text-german-gold mb-4">Safetech Innovations Global Services Ltd</h3>
                <p className="text-gray-300 mb-6">
                  Safetech Innovations is a global cybersecurity company dedicated to protecting organizations from 
                  cyber threats and providing cutting-edge security solutions. Founded by a team of professionals with 
                  extensive experience in information security, Safetech is committed to excellence, innovation, and 
                  client satisfaction, offering comprehensive services including security monitoring, penetration testing, 
                  and cybersecurity consulting to help businesses worldwide defend against evolving digital threats.
                </p>
                <a 
                  href="https://www.safetechinnovations.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <Button 
                    variant="default" 
                    className="bg-german-red hover:bg-red-700 text-white"
                  >
                    Visit Website
                  </Button>
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

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
    </div>
  );
};

export default Sponsors;
