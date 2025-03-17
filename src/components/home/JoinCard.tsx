
import { Users } from "lucide-react";
import { motion } from "framer-motion";

interface JoinCardProps {
  delay?: number;
}

const JoinCard = ({ delay = 0.5 }: JoinCardProps) => {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay }}
      className="bg-black border border-german-red rounded-lg p-6 hover:border-german-gold transition-colors duration-300"
    >
      <Users className="h-12 w-12 text-white mb-4" />
      <h3 className="text-xl font-bold mb-2 text-white">Join Us</h3>
      <p className="text-gray-300">Become part of our growing team</p>
    </motion.div>
  );
};

export default JoinCard;
