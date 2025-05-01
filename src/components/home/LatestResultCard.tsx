
import { useEffect, useState } from "react";
import { format, parseISO } from "date-fns";
import { Trophy, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import { getLatestResult } from "@/utils/fixtureUtils";
import { useToast } from "@/components/ui/use-toast";

interface Result {
  id: string;
  team: string;
  opponent: string;
  date: string;
  team_score: number;
  opponent_score: number;
  competition: string;
  is_home: boolean;
  motm?: string;
}

export const LatestResultCard = () => {
  const { t } = useLanguage();
  const [latestResult, setLatestResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchLatestResult = async () => {
      setLoading(true);
      try {
        const result = await getLatestResult();
        console.log("Latest result data:", result);
        setLatestResult(result);
      } catch (error) {
        console.error("Error fetching latest result:", error);
        toast({
          title: "Error",
          description: "Could not load latest result",
          variant: "destructive",
        });
        setLatestResult(null);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestResult();
  }, [toast]);

  const getResultText = (result: Result) => {
    if (result.team_score > result.opponent_score) return "WIN";
    if (result.team_score < result.opponent_score) return "LOSS";
    return "DRAW";
  };

  const getResultClass = (result: Result) => {
    if (result.team_score > result.opponent_score) return "bg-green-800";
    if (result.team_score < result.opponent_score) return "bg-red-800";
    return "bg-gray-700";
  };

  return (
    <Card className="bg-gray-900 border-german-gold border-2 h-full">
      <CardHeader className="bg-german-gold">
        <CardTitle className="flex items-center text-black">
          <Trophy className="mr-2 h-5 w-5 text-black" />
          {t("latest_result")}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 flex-grow">
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 text-german-gold animate-spin" />
          </div>
        ) : latestResult ? (
          <div className="space-y-4 text-white">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-medium bg-gray-800 text-german-gold px-2 py-0.5 rounded">
                  {latestResult.team}
                </span>
                <span className="text-xs font-medium bg-gray-800 text-white px-2 py-0.5 rounded">
                  {latestResult.competition}
                </span>
              </div>
              <h3 className="text-lg font-bold">
                {latestResult.is_home ? "German Exiles" : latestResult.opponent} vs {latestResult.is_home ? latestResult.opponent : "German Exiles"}
              </h3>
              <p className="text-sm text-gray-300">
                {format(parseISO(latestResult.date), "MMMM d, yyyy")}
              </p>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">
                {latestResult.team_score} - {latestResult.opponent_score}
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-bold ${getResultClass(latestResult)}`}>
                {getResultText(latestResult)}
              </div>
            </div>
            
            {latestResult.motm && (
              <div className="mt-2">
                <p className="text-sm">
                  <span className="text-german-gold font-semibold">{t("man_of_the_match")}: </span>
                  {latestResult.motm}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="py-4 text-center">
            <p className="text-gray-300">{t("no_results_yet")}</p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Link to="/fixtures" className="w-full">
          <Button className="w-full bg-german-red hover:bg-german-gold text-white transition-colors">
            {t("view_all_results")}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};
