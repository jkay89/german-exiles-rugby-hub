import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, Gift, RefreshCw, Users, Crown, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface WinnerResult {
  id: string;
  user_id: string;
  draw_id: string;
  matches: number;
  prize_amount: number;
  is_winner: boolean;
  created_at: string;
  draw_date: string;
  winning_numbers: number[];
  jackpot_amount: number;
  lucky_dip_amount: number;
  is_test_draw?: boolean;
  user_email?: string;
}

const RecentWinnersSection = () => {
  const [winners, setWinners] = useState<WinnerResult[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchRecentWinners = async () => {
    setLoading(true);
    try {
      // First get the lottery results with draw information
      const { data: resultsData, error: resultsError } = await supabase
        .from('lottery_results')
        .select(`
          *,
          lottery_draws!inner(
            draw_date,
            winning_numbers,
            jackpot_amount,
            lucky_dip_amount,
            is_test_draw
          )
        `)
        .eq('is_winner', true)
        .order('created_at', { ascending: false })
        .limit(20);

      if (resultsError) throw resultsError;

      // Get user emails for each winner
      const winnersWithEmails = await Promise.all(
        (resultsData || []).map(async (result: any) => {
          try {
            const { data: authUser, error: userError } = await supabase.auth.admin.getUserById(result.user_id);
            
            return {
              ...result,
              draw_date: result.lottery_draws.draw_date,
              winning_numbers: result.lottery_draws.winning_numbers,
              jackpot_amount: result.lottery_draws.jackpot_amount,
              lucky_dip_amount: result.lottery_draws.lucky_dip_amount,
              is_test_draw: result.lottery_draws.is_test_draw,
              user_email: authUser?.user?.email || 'Unknown'
            };
          } catch (error) {
            console.error('Error fetching user email:', error);
            return {
              ...result,
              draw_date: result.lottery_draws.draw_date,
              winning_numbers: result.lottery_draws.winning_numbers,
              jackpot_amount: result.lottery_draws.jackpot_amount,
              lucky_dip_amount: result.lottery_draws.lucky_dip_amount,
              is_test_draw: result.lottery_draws.is_test_draw,
              user_email: 'Unknown'
            };
          }
        })
      );

      setWinners(winnersWithEmails);
    } catch (error) {
      console.error('Error fetching recent winners:', error);
      toast({
        title: "Error",
        description: "Failed to fetch recent winners",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecentWinners();
  }, []);

  const getWinnerTypeInfo = (matches: number, prizeAmount: number) => {
    if (matches === 4) {
      return {
        type: "Jackpot Winner",
        icon: Crown,
        color: "bg-gradient-to-r from-yellow-500 to-amber-600",
        textColor: "text-yellow-100",
        borderColor: "border-yellow-400"
      };
    } else {
      return {
        type: "Lucky Dip Winner",
        icon: Sparkles,
        color: "bg-gradient-to-r from-green-500 to-emerald-600",
        textColor: "text-green-100",
        borderColor: "border-green-400"
      };
    }
  };

  const jackpotWinners = winners.filter(w => w.matches === 4);
  const luckyDipWinners = winners.filter(w => w.matches === 0);

  if (loading) {
    return (
      <Card className="bg-gray-900 border-gray-800 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-400" />
            Recent Winners
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="w-6 h-6 animate-spin text-gray-400" />
            <span className="ml-2 text-gray-400">Loading winners...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-900 border-gray-800 text-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-400" />
            Recent Winners
          </div>
          <Button 
            onClick={fetchRecentWinners}
            variant="ghost" 
            size="sm"
            className="text-gray-400 hover:text-white"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-medium text-gray-300">Total Winners</span>
            </div>
            <div className="text-2xl font-bold text-white">{winners.length}</div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center gap-2 mb-2">
              <Crown className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-medium text-gray-300">Jackpot Winners</span>
            </div>
            <div className="text-2xl font-bold text-yellow-400">{jackpotWinners.length}</div>
          </div>

          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-green-400" />
              <span className="text-sm font-medium text-gray-300">Lucky Dip Winners</span>
            </div>
            <div className="text-2xl font-bold text-green-400">{luckyDipWinners.length}</div>
          </div>
        </div>

        {winners.length === 0 ? (
          <div className="text-center py-8">
            <Trophy className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No winners found yet</p>
            <p className="text-sm text-gray-500">Winners will appear here after draws are completed</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {winners.map((winner) => {
              const winnerInfo = getWinnerTypeInfo(winner.matches, winner.prize_amount);
              const WinnerIcon = winnerInfo.icon;
              
              return (
                <div 
                  key={winner.id} 
                  className={`p-4 rounded-lg border-l-4 ${winnerInfo.borderColor} bg-gray-800/50 hover:bg-gray-800 transition-colors`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${winnerInfo.color}`}>
                        <WinnerIcon className={`w-4 h-4 ${winnerInfo.textColor}`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-white">{winner.user_email}</span>
                          <Badge 
                            variant={winner.matches === 4 ? "default" : "secondary"}
                            className={winner.matches === 4 ? "bg-yellow-500/20 text-yellow-400" : "bg-green-500/20 text-green-400"}
                          >
                            {winnerInfo.type}
                          </Badge>
                          {winner.is_test_draw && (
                            <Badge variant="outline" className="border-orange-400 text-orange-400">
                              Test Draw
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-400 mt-1">
                          <span>Draw: {new Date(winner.draw_date).toLocaleDateString('en-GB')}</span>
                          {winner.matches === 4 && (
                            <span>Numbers: {winner.winning_numbers.join(', ')}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-lg font-bold ${winner.matches === 4 ? 'text-yellow-400' : 'text-green-400'}`}>
                        £{winner.prize_amount.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(winner.created_at).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentWinnersSection;