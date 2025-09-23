import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Calendar, Mail, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const LotterySuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [isSubscription, setIsSubscription] = useState(false);

  useEffect(() => {
    // Process the lottery purchase when component mounts
    if (sessionId) {
      processLotteryPurchase();
    }
  }, [sessionId]);

  const processLotteryPurchase = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        console.warn("No active session for lottery processing");
        return;
      }

      const { error } = await supabase.functions.invoke('process-lottery-purchase', {
        body: { sessionId },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        }
      });

      if (error) {
        console.error('Error processing lottery purchase:', error);
      }
    } catch (error) {
      console.error('Failed to process lottery purchase:', error);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="bg-gradient-to-br from-green-600/20 to-blue-600/20 border-green-600/30">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 w-16 h-16 bg-green-600 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-3xl text-green-400">Payment Successful!</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 text-center">
                <p className="text-xl text-gray-300">
                  Your lottery entry has been confirmed for the next draw.
                </p>
                
                <div className="bg-gray-900 rounded-lg p-6 space-y-4">
                  <div className="flex items-center justify-center gap-2 text-blue-400">
                    <Calendar className="w-5 h-5" />
                    <span className="font-medium">Next Draw: Last week of {new Date().toLocaleString('default', { month: 'long' })}</span>
                  </div>
                  
                  <div className="text-gray-300 space-y-2">
                    <p className="flex items-center justify-center gap-2">
                      <Mail className="w-4 h-4" />
                      You'll receive confirmation via email shortly
                    </p>
                    <p className="text-sm text-gray-400">
                      Winners will be notified within 3 days of the draw
                    </p>
                  </div>
                </div>

                <div className="bg-blue-900/20 rounded-lg p-4 border border-blue-600/30">
                  <h3 className="font-semibold text-blue-400 mb-2">What happens next?</h3>
                  <ul className="text-sm text-gray-300 space-y-1 text-left">
                    <li>• Your numbers are locked in for the monthly draw</li>
                    <li>• Draw results will be live-streamed on Facebook</li>
                    <li>• Winners published on our social media</li>
                    <li>• Prizes paid within 2-3 working days</li>
                  </ul>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                  <Button size="lg" asChild>
                    <Link to="/lottery">Enter Another Draw</Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link to="/lottery" className="inline-flex items-center gap-2">
                      <ArrowLeft className="w-4 h-4" />
                      Back to Lottery
                    </Link>
                  </Button>
                </div>

                {sessionId && (
                  <p className="text-xs text-gray-500 mt-6">
                    Reference: {sessionId}
                  </p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default LotterySuccess;