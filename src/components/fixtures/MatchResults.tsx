
import { motion } from "framer-motion";
import { format } from "date-fns";
import { Trophy } from "lucide-react";
import { MatchResult } from "@/utils/playerStats";

interface MatchResultsProps {
  results: MatchResult[];
}

const MatchResults = ({ results }: MatchResultsProps) => {
  return (
    <div className="bg-black border border-german-red rounded-lg p-6 hover:border-german-gold transition-colors duration-300">
      <h2 className="text-2xl font-bold mb-4 text-white">Match Results</h2>
      
      {results.length > 0 ? (
        <div className="space-y-4">
          {results.map((result, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="border-l-4 border-german-red p-4 bg-gray-900"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-bold text-white">
                    {result.isHome ? "German Exiles" : result.opponent} vs {result.isHome ? result.opponent : "German Exiles"}
                  </p>
                  <p className="text-sm text-gray-300">
                    {format(new Date(result.date), "dd MMMM yyyy")}
                  </p>
                  <p className="text-sm text-german-gold">{result.location}</p>
                </div>
                <div className="text-2xl font-bold text-white">
                  {result.homeScore} - {result.awayScore}
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
          <h3 className="text-xl font-medium text-white mb-2">No Results Yet</h3>
          <p className="text-center text-gray-400">
            The German Exiles haven't played any official matches yet. 
            Stay tuned for our upcoming fixtures!
          </p>
        </div>
      )}
    </div>
  );
};

export default MatchResults;
