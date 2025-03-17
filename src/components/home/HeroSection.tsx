
import { motion } from "framer-motion";

interface HeroSectionProps {
  isLoaded: boolean;
}

const HeroSection = ({ isLoaded }: HeroSectionProps) => {
  return (
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
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            German Exiles <span className="text-german-gold">Rugby League</span>
          </h1>
          <p className="text-xl text-gray-200 mx-auto">
            Bridging German talent worldwide through Rugby League excellence
          </p>
        </div>
      </div>
    </motion.section>
  );
};

export default HeroSection;
