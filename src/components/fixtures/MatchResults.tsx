
import { motion } from "framer-motion";
import { format, parseISO } from "date-fns";
import { Trophy, Loader2, MapPin } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface MatchResult {
  id: string;
  team: string;
  opponent: string;
  date: string;
  team_score: number;
  opponent_score: number;
  competition: string;
  is_home: boolean;
  motm?: string;
  location?: string;
}

interface MatchResultsProps {
  results: MatchResult[];
  loading?: boolean;
}

const MatchResults = ({ results, loading = false }: MatchResultsProps) => {
  const { t } = useLanguage();
  
  return (
    <div className="bg-black border border-german-red rounded-lg p-6 hover:border-german-gold transition-colors duration-300">
      <h2 className="text-2xl font-bold mb-4 text-white">{t("match_results")}</h2>
      
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 text-german-gold animate-spin" />
        </div>
      ) : results.length > 0 ? (
        <div className="space-y-4">
          {results.map((result, index) => (
            <motion.div
              key={result.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="border-l-4 border-german-red p-4 bg-gray-900"
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-medium bg-gray-800 text-german-gold px-2 py-0.5 rounded">
                      {result.team}
                    </span>
                    <span className="text-xs font-medium bg-gray-800 text-white px-2 py-0.5 rounded">
                      {result.competition}
                    </span>
                  </div>
                  <p className="font-bold text-white">
                    {result.is_home ? "German Exiles" : result.opponent} vs {result.is_home ? result.opponent : "German Exiles"}
                  </p>
                  <p className="text-sm text-gray-300">
                    {format(parseISO(result.date), "dd MMMM yyyy")}
                  </p>
                  {result.location && (
                    <p className="text-sm text-german-gold flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {result.location}
                    </p>
                  )}
                  {result.motm && (
                    <p className="text-sm text-gray-300 mt-1">
                      <span className="text-german-gold">MOTM:</span> {result.motm}
                    </p>
                  )}
                </div>
                <div className="mt-3 md:mt-0">
                  <div className="text-2xl font-bold text-white bg-gray-800 px-4 py-2 rounded text-center">
                    {result.is_home 
                      ? `${result.team_score} - ${result.opponent_score}` 
                      : `${result.opponent_score} - ${result.team_score}`}
                  </div>
                  <div className="text-center text-xs mt-1 text-gray-400">
                    {result.is_home && result.team_score > result.opponent_score && 'WIN'}
                    {result.is_home && result.team_score < result.opponent_score && 'LOSS'}
                    {!result.is_home && result.team_score > result.opponent_score && 'WIN'}
                    {!result.is_home && result.team_score < result.opponent_score && 'LOSS'}
                    {result.team_score === result.opponent_score && 'DRAW'}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-8 bg-gray-900 rounded-lg">
          <div className="bg-gray-800 p-4 rounded-full mb-4">
            <Trophy className="h-12 w-12 text-german-gold" />
          </div>
          <h3 className="text-xl font-medium text-white mb-2">{t("no_results_yet")}</h3>
          <p className="text-center text-gray-400">
            {t("no_matches_text")}
          </p>
        </div>
      )}
    </div>
  );
};

export default MatchResults;
