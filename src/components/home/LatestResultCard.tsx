
import { Trophy } from "lucide-react";
import { motion } from "framer-motion";

interface LatestResultCardProps {
  delay?: number;
}

const LatestResultCard = ({ delay = 0.4 }: LatestResultCardProps) => {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay }}
      className="bg-black border border-german-red rounded-lg p-6 hover:border-german-gold transition-colors duration-300"
    >
      <Trophy className="h-12 w-12 text-german-gold mb-4" />
      <h3 className="text-xl font-bold mb-2 text-white">Latest Result</h3>
      <p className="text-gray-300">Coming Soon</p>
    </motion.div>
  );
};

export default LatestResultCard;
