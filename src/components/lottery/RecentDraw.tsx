import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface LotteryDraw {
  id: string;
  draw_date: string;
  winning_numbers: number[];
  jackpot_amount: number;
  lucky_dip_amount: number;
}

const RecentDraw = () => {
  const [recentDraw, setRecentDraw] = useState<LotteryDraw | null>(null);
  const [nextDrawDate, setNextDrawDate] = useState<string>("");
  const [timeRemaining, setTimeRemaining] = useState<string>("");

  useEffect(() => {
    fetchRecentDraw();
    fetchNextDrawDate();
  }, []);

  useEffect(() => {
    if (nextDrawDate) {
      const timer = setInterval(updateCountdown, 1000);
      return () => clearInterval(timer);
    }
  }, [nextDrawDate]);

  const fetchRecentDraw = async () => {
    try {
      const { data, error } = await supabase
        .from('lottery_draws')
        .select('*')
        .eq('is_test_draw', false) // Only fetch real draws, not test draws
        .order('draw_date', { ascending: false })
        .limit(1);

      if (error) {
        console.error('Error fetching recent draw:', error);
        return;
      }

      if (data && data.length > 0) {
        setRecentDraw(data[0]);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchNextDrawDate = async () => {
    try {
      // For now, we'll calculate the next draw date as the last day of next month
      // This can be made configurable via admin panel later
      const now = new Date();
      const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      setNextDrawDate(nextMonth.toISOString().split('T')[0]);
    } catch (error) {
      console.error('Error calculating next draw date:', error);
    }
  };

  const updateCountdown = () => {
    if (!nextDrawDate) return;

    const now = new Date().getTime();
    const drawTime = new Date(nextDrawDate + " 19:50:00").getTime();
    const difference = drawTime - now;

    if (difference > 0) {
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeRemaining(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    } else {
      setTimeRemaining("Draw in progress or complete");
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-6 mb-8">
      {/* Recent Draw */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Trophy className="w-5 h-5 text-yellow-400" />
            Recent Draw
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentDraw ? (
            <div className="space-y-4">
              <p className="text-gray-400">
                {new Date(recentDraw.draw_date).toLocaleDateString('en-GB')}
              </p>
              <div className="flex gap-2 flex-wrap">
                {recentDraw.winning_numbers.map((number, index) => (
                  <Badge 
                    key={index}
                    variant="secondary"
                    className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-600 text-white font-bold"
                  >
                    {number}
                  </Badge>
                ))}
              </div>
              <div className="text-sm text-gray-400">
                <p>Jackpot: £{recentDraw.jackpot_amount.toLocaleString()}</p>
                <p>Lucky Dip: £{recentDraw.lucky_dip_amount}</p>
              </div>
            </div>
          ) : (
            <p className="text-gray-400">No recent draws available</p>
          )}
        </CardContent>
      </Card>

      {/* Next Draw Countdown */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Calendar className="w-5 h-5 text-blue-400" />
            Next Draw
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-gray-400">
              {nextDrawDate ? new Date(nextDrawDate).toLocaleDateString('en-GB') : 'TBD'}
            </p>
            <div className="text-2xl font-bold text-blue-400">
              {timeRemaining || 'Calculating...'}
            </div>
            <p className="text-sm text-gray-400">
              Entries close at 7:50 PM
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RecentDraw;