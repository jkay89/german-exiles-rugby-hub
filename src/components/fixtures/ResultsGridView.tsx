
import React from "react";
import { motion } from "framer-motion";
import { Result } from "@/hooks/useFixtures";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPinIcon, Calendar, Trophy } from "lucide-react";
import { format, parseISO } from 'date-fns';

interface ResultsGridViewProps {
  results: Result[];
}

const ResultsGridView = ({ results }: ResultsGridViewProps) => {
  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), "dd MMMM yyyy");
    } catch (error) {
      console.error("Error formatting date:", error, dateString);
      return dateString;
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {results.map((result) => (
        <Card key={result.id} className="bg-gradient-to-b from-gray-900 to-gray-800 text-white h-full border border-gray-700 hover:border-german-gold transition-all duration-300 shadow-md hover:shadow-german-gold/20">
          <CardHeader className="border-b border-gray-700 pb-4">
            <div className="flex justify-between items-center mb-2">
              <span className={`text-xs font-medium px-2 py-1 rounded ${result.is_home ? 'bg-green-600 text-white' : 'bg-blue-600 text-white'}`}>
                {result.is_home ? 'Home' : 'Away'}
              </span>
              <span className="text-xs font-medium bg-gray-700 text-german-gold px-2 py-1 rounded">
                {result.competition || "Friendly"}
              </span>
            </div>
            <CardTitle className="text-xl font-bold text-german-gold flex items-center justify-between">
              <span className="truncate">{result.opponent}</span>
              <span className="text-sm ml-2 text-gray-400 truncate">({result.team})</span>
            </CardTitle>
            <div className="mt-2">
              <div className="flex items-center text-sm text-gray-300">
                <Calendar className="h-4 w-4 mr-2 text-german-gold" />
                {formatDate(result.date)}
              </div>
              <div className="mt-2 text-center">
                <div className="text-2xl font-bold text-white bg-gray-800 px-4 py-2 rounded">
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
          </CardHeader>
          <CardContent className="pt-4">
            {result.location && (
              <div className="flex items-start">
                <MapPinIcon className="h-4 w-4 mt-1 mr-2 text-german-gold flex-shrink-0" />
                <p className="text-sm text-gray-300">{result.location}</p>
              </div>
            )}
            {result.motm && (
              <div className="flex items-center mt-2">
                <Trophy className="h-4 w-4 mr-2 text-german-gold" />
                <p className="text-sm text-gray-300">
                  <span className="text-german-gold">MOTM:</span> {result.motm}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ResultsGridView;
