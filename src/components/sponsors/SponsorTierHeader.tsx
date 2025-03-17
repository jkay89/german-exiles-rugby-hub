
import { motion } from "framer-motion";

interface SponsorTierHeaderProps {
  title: string;
  delay?: number;
}

const SponsorTierHeader = ({ title, delay = 0.1 }: SponsorTierHeaderProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="text-center mb-12"
    >
      <h2 className="text-3xl font-bold text-german-gold mb-4">{title}</h2>
    </motion.div>
  );
};

export default SponsorTierHeader;
