import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, CheckCircle, Play } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface DrawResult {
  id: string;
  draw_date: string;
  winning_numbers: number[];
  jackpot_amount: number;
  lucky_dip_amount: number;
  created_at: string;
  certificate_url?: string;
  random_org_signature?: string;
  is_test_draw?: boolean;
}

const TestDraw = () => {
  const [currentJackpot, setCurrentJackpot] = useState(50000);
  const [latestResult, setLatestResult] = useState<DrawResult | null>(null);
  const [drawInProgress, setDrawInProgress] = useState(false);
  const [drawNumbers, setDrawNumbers] = useState<number[]>([]);
  const [showingNumbers, setShowingNumbers] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchCurrentJackpot();
    fetchLatestResult();
  }, []);

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
    // Prevent multiple simultaneous draws
    if (drawInProgress) {
      console.log('Draw already in progress, ignoring request');
      return;
    }
    
    setDrawInProgress(true);
    setDrawNumbers([]);
    setShowingNumbers(false);
    
    try {
      const testDrawDate = new Date().toISOString().split('T')[0];
      
      console.log('Starting lottery draw...');
      
      // Call the edge function to conduct the draw using RANDOM.ORG
      const { data, error } = await supabase.functions.invoke('conduct-lottery-draw', {
        body: {
          drawDate: testDrawDate,
          jackpotAmount: currentJackpot,
          isTestDraw: true // Mark this as a test draw
        }
      });

      if (error) {
        console.error('Draw API error:', error);
        throw new Error(error.message || 'Failed to conduct draw');
      }

      console.log('Draw API response:', data);

      // Check for API-level errors in response
      if (data?.error) {
        console.error('Draw API returned error:', data.error);
        throw new Error(data.error);
      }

      // Show animated number reveal only if we have valid data
      if (data?.drawResult?.winningNumbers && Array.isArray(data.drawResult.winningNumbers)) {
        setShowingNumbers(true);
        const numbers = data.drawResult.winningNumbers;
        
        console.log('Starting number animation with:', numbers);
        
        // Animate numbers appearing one by one
        for (let i = 0; i < numbers.length; i++) {
          await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay between numbers
          setDrawNumbers(prev => [...prev, numbers[i]]);
        }
        
        // Show completion message after all numbers are revealed
        setTimeout(() => {
          toast({
            title: "Draw Complete!",
            description: "The winning numbers have been drawn and results updated.",
          });
        }, 1000);
        
        // Refresh the latest result after animation completes
        setTimeout(() => {
          fetchLatestResult();
        }, 2000);
      } else {
        console.error('Invalid draw result structure:', data);
        throw new Error('Invalid response structure from draw API');
      }
      
    } catch (error) {
      console.error('Error conducting draw:', error);
      toast({
        title: "Draw Error",
        description: error instanceof Error ? error.message : "There was an error conducting the draw. Please try again.",
        variant: "destructive",
      });
      
      // Reset UI state immediately on error
      setDrawInProgress(false);
      setShowingNumbers(false);
      setDrawNumbers([]);
    } finally {
      // Only reset after successful completion (longer delay for animation)
      if (showingNumbers) {
        setTimeout(() => {
          setDrawInProgress(false);
          setShowingNumbers(false);
          setDrawNumbers([]);
        }, 4000); // Longer delay to allow animation to complete
      }
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
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
              <span className="block text-purple-400">Test Draw</span>
              Official Live Draw Preview
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8">
              Test the official lottery draw functionality powered by RANDOM.ORG
            </p>
            <div className="bg-red-600/20 border border-red-600 rounded-lg p-4 mb-8">
              <p className="text-red-400 font-semibold">⚠️ TEST MODE - This is for testing purposes only</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Current Jackpot Display */}
      <section className="py-8 px-4 bg-gray-950">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border-purple-600/30">
            <CardContent className="text-center py-6">
              <div className="text-3xl font-bold text-yellow-400">
                Current Jackpot: £{currentJackpot.toLocaleString()}
              </div>
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
                Official Live Draw Test
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

                {!drawInProgress && (
                  <Button 
                    onClick={conductDraw}
                    size="lg"
                    className="bg-purple-600 hover:bg-purple-700 text-xl px-8 py-4"
                  >
                    <Play className="w-6 h-6 mr-2" />
                    Pull
                  </Button>
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
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* Test Mode Disclaimer */}
      <section className="py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-red-900/20 border-red-600">
            <CardContent className="text-center py-6">
              <h3 className="text-xl font-bold text-red-400 mb-2">Test Mode Active</h3>
              <p className="text-red-300">
                This is a test version of the official live draw. All functionality is identical to the live version, 
                but this page is only for testing and preview purposes.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default TestDraw;