import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Trophy, Users, ExternalLink, Play, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { DrawTabNavigation } from "@/components/lottery/DrawTabNavigation";
import { getNextDrawDateFromSettings } from "@/utils/drawDateUtils";

interface DrawResult {
  id: string;
  draw_date: string;
  winning_numbers: number[];
  jackpot_amount: number;
  lucky_dip_amount: number;
  created_at: string;
  certificate_url?: string;
  random_org_signature?: string;
}

const LotteryDraw = () => {
  const [nextDrawDate, setNextDrawDate] = useState<Date | null>(null);
  const [timeUntilDraw, setTimeUntilDraw] = useState<string>("");
  const [currentJackpot, setCurrentJackpot] = useState(50000);
  const [latestResult, setLatestResult] = useState<DrawResult | null>(null);
  const [isDrawActive, setIsDrawActive] = useState(false);
  const [drawInProgress, setDrawInProgress] = useState(false);
  const [drawNumbers, setDrawNumbers] = useState<number[]>([]);
  const [showingNumbers, setShowingNumbers] = useState(false);
  const [drawCompleted, setDrawCompleted] = useState(false);
  const drawInProgressRef = useRef(false);
  const { toast } = useToast();

  useEffect(() => {
    calculateNextDrawDate();
    fetchCurrentJackpot();
    fetchLatestResult();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      updateCountdown();
    }, 1000);

    return () => clearInterval(timer);
  }, [nextDrawDate]);

  // Reset drawCompleted when nextDrawDate changes (new draw scheduled)
  useEffect(() => {
    setDrawCompleted(false);
  }, [nextDrawDate]);

  const calculateNextDrawDate = async () => {
    try {
      const drawDate = await getNextDrawDateFromSettings();
      setNextDrawDate(drawDate);
    } catch (error) {
      console.error('Error fetching next draw date:', error);
      // Fallback to default calculation
      const now = new Date();
      const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      const drawTime = new Date(lastDayOfMonth);
      drawTime.setHours(20, 0, 0, 0);
      
      if (now > drawTime) {
        const lastDayOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 2, 0);
        drawTime.setFullYear(lastDayOfNextMonth.getFullYear());
        drawTime.setMonth(lastDayOfNextMonth.getMonth());
        drawTime.setDate(lastDayOfNextMonth.getDate());
      }
      
      setNextDrawDate(drawTime);
    }
  };

  const updateCountdown = () => {
    if (!nextDrawDate) return;
    
    const now = new Date().getTime();
    const drawTime = nextDrawDate.getTime();
    const difference = drawTime - now;

    if (difference > 0) {
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeUntilDraw(`${days}d ${hours}h ${minutes}m ${seconds}s`);
      
      // Enable live draw if within 5 minutes
      setIsDrawActive(difference <= 5 * 60 * 1000);
    } else {
      setTimeUntilDraw("Draw in progress...");
      setIsDrawActive(true);
      
      // Automatically conduct draw when timer hits zero (only once)
      if (!drawInProgress && !drawCompleted && !drawInProgressRef.current && difference <= 0) {
        setDrawCompleted(true); // Prevent multiple calls
        drawInProgressRef.current = true; // Immediate protection against race conditions
        conductDraw();
      }
    }
  };

  const fetchCurrentJackpot = async () => {
    try {
      const { data, error } = await supabase
        .from('lottery_settings')
        .select('setting_value')
        .eq('setting_key', 'current_jackpot')
        .maybeSingle();

      if (error) throw error;
      if (data) {
        setCurrentJackpot(Number(data.setting_value));
      }
    } catch (error) {
      console.error('Error fetching current jackpot:', error);
    }
  };

  const fetchLatestResult = async () => {
    try {
      const { data, error } = await supabase
        .from('lottery_draws')
        .select('*')
        .eq('is_test_draw', false) // Only fetch real draws, not test draws
        .order('draw_date', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      if (data) {
        setLatestResult(data as DrawResult);
      }
    } catch (error) {
      console.error('Error fetching latest result:', error);
    }
  };

  const conductDraw = async () => {
    // Extra protection: check if draw already completed today or in progress
    if (drawCompleted || drawInProgressRef.current) {
      console.log('Draw already completed or in progress, skipping...');
      return;
    }

    // Set both state and ref to prevent race conditions
    setDrawInProgress(true);
    drawInProgressRef.current = true;
    setDrawNumbers([]);
    setShowingNumbers(false);
    
    try {
      // Check if a draw has already been conducted today
      const today = new Date().toISOString().split('T')[0];
      const { data: existingDraw } = await supabase
        .from('lottery_draws')
        .select('id')
        .eq('draw_date', today)
        .eq('is_test_draw', false)
        .maybeSingle();

      if (existingDraw) {
        console.log('Draw already exists for today, skipping...');
        setDrawCompleted(true);
        toast({
          title: "Draw Already Complete",
          description: "Today's draw has already been conducted.",
        });
        return;
      }

      // Call the edge function to conduct the draw using RANDOM.ORG
      const { data, error } = await supabase.functions.invoke('conduct-lottery-draw', {
        body: {
          drawDate: nextDrawDate?.toISOString().split('T')[0],
          jackpotAmount: currentJackpot
        }
      });

      if (error) throw error;

      // Mark as completed immediately to prevent duplicate calls
      setDrawCompleted(true);

      // Show animated number reveal
      if (data.drawResult && data.drawResult.winningNumbers) {
        setShowingNumbers(true);
        const numbers = data.drawResult.winningNumbers;
        
        // Animate numbers appearing one by one
        for (let i = 0; i < numbers.length; i++) {
          await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay between numbers
          setDrawNumbers(prev => [...prev, numbers[i]]);
        }
        
        // Show completion message after all numbers are revealed
        setTimeout(() => {
          toast({
            title: "Draw Complete!",
            description: `Winners: ${data.drawResult.jackpotWinners} jackpot, ${data.drawResult.luckyDipWinners} lucky dip. Notifications sent!`,
          });
        }, 1000);
      }

      // Refresh the latest result and recalculate next draw date
      fetchLatestResult();
      calculateNextDrawDate(); // This will fetch the updated next draw date from settings
      
    } catch (error) {
      console.error('Error conducting draw:', error);
      setDrawCompleted(false); // Reset on error so they can try again
      drawInProgressRef.current = false; // Reset ref on error
      toast({
        title: "Draw Error",
        description: "There was an error conducting the draw. Please try again.",
        variant: "destructive",
      });
    } finally {
      setTimeout(() => {
        setDrawInProgress(false);
        setShowingNumbers(false);
        setDrawNumbers([]);
        // Reset completion flag after successful draw to allow future draws
        if (drawCompleted) {
          setTimeout(() => {
            setDrawCompleted(false);
            drawInProgressRef.current = false;
          }, 300000); // 5 minutes
        }
      }, 3000); // Reset after 3 seconds
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Tab Navigation */}
      <DrawTabNavigation />
      
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20" />
        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="block text-purple-400">The Draw</span>
              Live Monthly Drawing
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8">
              Witness the official lottery draw powered by RANDOM.ORG
            </p>
          </motion.div>
        </div>
      </section>

      {/* Countdown Section */}
      <section className="py-12 px-4 bg-gray-950">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border-purple-600/30">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl text-purple-400 flex items-center justify-center gap-3">
                <Clock className="w-8 h-8" />
                Next Draw Countdown
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <div className="text-5xl font-bold text-white font-mono">
                {timeUntilDraw}
              </div>
              <div className="text-xl text-gray-300">
                {nextDrawDate && (
                  <>
                    Draw Date: {nextDrawDate.toLocaleDateString('en-GB', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })} at 8:00 PM
                  </>
                )}
              </div>
              <div className="text-3xl font-bold text-yellow-400">
                Current Jackpot: £{currentJackpot.toLocaleString()}
              </div>
              {isDrawActive && (
                <Badge className="bg-green-600 text-white text-lg px-6 py-2">
                  <Play className="w-5 h-5 mr-2" />
                  DRAW NOW ACTIVE
                </Badge>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Live Draw Section */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-2xl text-center flex items-center justify-center gap-3">
                <Trophy className="w-6 h-6 text-yellow-400" />
                Official Live Draw
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="bg-gray-800 rounded-lg p-8 mb-6">
                  <div className="text-lg text-gray-300 mb-4">
                    Powered by RANDOM.ORG - Certified Tamper-Proof Random Numbers
                  </div>
                  <div className="flex items-center justify-center gap-2 text-green-400">
                    <CheckCircle className="w-5 h-5" />
                    <span>Third-Party Verified • Cryptographically Secure</span>
                  </div>
                </div>

                {isDrawActive && !drawInProgress && !drawCompleted && (
                  <div className="text-center">
                    <div className="animate-pulse">
                      <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4 animate-spin"></div>
                    </div>
                    <p className="text-xl text-purple-400">Preparing for automatic draw...</p>
                    <p className="text-gray-400">Draw will commence automatically when timer reaches zero</p>
                  </div>
                )}

                {drawInProgress && (
                  <div className="text-center space-y-6">
                    {showingNumbers ? (
                      <div>
                        <h3 className="text-2xl font-bold text-purple-400 mb-6">Drawing Numbers...</h3>
                        <div className="flex justify-center gap-4 mb-6">
                          {[1, 2, 3, 4].map((position, index) => (
                            <div 
                              key={position}
                              className="w-20 h-20 rounded-full border-4 border-purple-600 flex items-center justify-center relative overflow-hidden"
                            >
                              {drawNumbers[index] !== undefined ? (
                                <motion.div
                                  initial={{ scale: 0, rotate: 180 }}
                                  animate={{ scale: 1, rotate: 0 }}
                                  transition={{ 
                                    type: "spring", 
                                    stiffness: 200, 
                                    damping: 10,
                                    duration: 0.8 
                                  }}
                                  className="text-3xl font-bold text-white bg-gradient-to-br from-purple-600 to-blue-600 w-full h-full rounded-full flex items-center justify-center"
                                >
                                  {drawNumbers[index]}
                                </motion.div>
                              ) : (
                                <div className="animate-pulse">
                                  <div className="w-16 h-16 bg-purple-600/30 rounded-full animate-spin border-t-2 border-purple-400"></div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                        <p className="text-lg text-gray-300">
                          Drawing number {drawNumbers.length + 1} of 4...
                        </p>
                      </div>
                    ) : (
                      <div>
                        <div className="animate-spin w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                        <p className="text-xl text-purple-400">Connecting to RANDOM.ORG...</p>
                        <p className="text-gray-400">Generating certified random numbers</p>
                      </div>
                    )}
                  </div>
                )}

                {!isDrawActive && (
                  <div className="text-gray-400">
                    <Calendar className="w-8 h-8 mx-auto mb-2" />
                    <p>Automatic draw will commence when the countdown reaches zero</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Latest Result */}
      {latestResult && (
        <section className="py-12 px-4 bg-gray-950">
          <div className="max-w-4xl mx-auto">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-2xl text-center">Latest Draw Result</CardTitle>
                <p className="text-center text-gray-400">
                  Draw Date: {new Date(latestResult.draw_date).toLocaleDateString('en-GB')}
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className="flex justify-center gap-4 mb-6">
                    {latestResult.winning_numbers.map((number, index) => (
                      <div 
                        key={index}
                        className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-2xl font-bold text-white"
                      >
                        {number}
                      </div>
                    ))}
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-xl font-semibold mb-2 text-yellow-400">Jackpot Prize</h3>
                      <p className="text-2xl font-bold">£{latestResult.jackpot_amount.toLocaleString()}</p>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2 text-blue-400">Lucky Dip</h3>
                      <p className="text-2xl font-bold">5 winners × £{latestResult.lucky_dip_amount}</p>
                    </div>
                  </div>

                  {latestResult.certificate_url && (
                    <div className="mt-6 pt-6 border-t border-gray-800">
                      <Button variant="outline" asChild>
                        <a 
                          href={latestResult.certificate_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-2"
                        >
                          <ExternalLink className="w-4 h-4" />
                          View RANDOM.ORG Certificate
                        </a>
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* How It Works */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How Our Draw Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-center">Third-Party Verified</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 text-center">
                <p>
                  All numbers are generated by RANDOM.ORG, a trusted third-party service
                  that provides certified randomness. We cannot influence the outcome.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-center">Live & Transparent</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 text-center">
                <p>
                  The draw happens live on this page at the scheduled time. 
                  All participants can witness the numbers being drawn in real-time.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-center">Instant Notifications</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 text-center">
                <p>
                  Winners are automatically notified by email within minutes of the draw.
                  Results are immediately updated across all lottery pages.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LotteryDraw;