
import { Trophy, Star, CalendarCheck } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

interface LatestResultCardProps {
  delay?: number;
}

const LatestResultCard = ({ delay = 0.4 }: LatestResultCardProps) => {
  const { t } = useLanguage();
  
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay }}
      whileHover={{ scale: 1.03 }}
      className="bg-gradient-to-br from-gray-900 to-black border border-german-red rounded-lg p-6 hover:border-german-gold transition-all duration-300 shadow-lg relative overflow-hidden h-full"
    >
      <div className="absolute -right-10 -top-10 w-40 h-40 bg-german-red/10 rounded-full blur-2xl"></div>
      <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-german-gold/10 rounded-full blur-2xl"></div>
      
      <div className="flex items-center gap-3 mb-4">
        <Trophy className="h-8 w-8 text-german-gold" />
        <h3 className="text-2xl font-bold text-white">{t("latest_result")}</h3>
      </div>

      <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-5 transition-all">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + 0.2 }}
        >
          <p className="text-gray-300 mb-3">{t("match_results_soon")}</p>
          
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <CalendarCheck className="h-4 w-4 text-german-gold" />
              <p className="text-gray-400">{t("check_back")}</p>
            </div>
            
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-german-gold" />
              <p className="text-gray-400">{t("player_highlights")}</p>
            </div>
          </div>
          
          <div className="mt-4 pt-2 border-t border-gray-700">
            <p className="text-german-gold font-medium">{t("season_starting_soon")}</p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default LatestResultCard;
